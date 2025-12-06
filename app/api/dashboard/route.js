import connectMongoDB from "@/libs/mongodb";
import Customer from "@/models/customer";
import Payment from "@/models/payment";
import { adminAuth } from "@/libs/middleware";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const authResult = adminAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    await connectMongoDB();

    // Run all queries in parallel for better performance
    const [
      totalCustomers,
      totalDueResult,
      currentMonthResult,
      last6MonthsResult,
      villageSummaryResult,
    ] = await Promise.all([
      // Total customers count
      Customer.countDocuments(),

      // Total due using aggregation (much faster)
      Payment.aggregate([
        { $match: { status: "unpaid" } },
        {
          $lookup: {
            from: "customers",
            localField: "customerId",
            foreignField: "_id",
            as: "customer",
          },
        },
        { $unwind: "$customer" },
        {
          $group: {
            _id: null,
            totalDue: { $sum: "$customer.billAmount" },
          },
        },
      ]),

      // Current month collection
      (async () => {
        const today = new Date();
        const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
        const result = await Payment.aggregate([
          { $match: { month: currentMonth, status: "paid" } },
          {
            $lookup: {
              from: "customers",
              localField: "customerId",
              foreignField: "_id",
              as: "customer",
            },
          },
          { $unwind: "$customer" },
          {
            $group: {
              _id: null,
              total: { $sum: "$customer.billAmount" },
            },
          },
        ]);
        return result[0]?.total || 0;
      })(),

      // Last 6 months using aggregation
      (async () => {
        const today = new Date();
        const months = [];
        for (let i = 5; i >= 0; i--) {
          const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
          months.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`);
        }

        const results = await Payment.aggregate([
          { $match: { month: { $in: months }, status: "paid" } },
          {
            $lookup: {
              from: "customers",
              localField: "customerId",
              foreignField: "_id",
              as: "customer",
            },
          },
          { $unwind: "$customer" },
          {
            $group: {
              _id: "$month",
              collected: { $sum: "$customer.billAmount" },
            },
          },
        ]);

        // Map results to include all months
        return months.map((month) => {
          const result = results.find((r) => r._id === month);
          return {
            month,
            collected: result?.collected || 0,
          };
        });
      })(),

      // Village summary using aggregation
      Customer.aggregate([
        {
          $lookup: {
            from: "payments",
            localField: "_id",
            foreignField: "customerId",
            as: "payments",
          },
        },
        {
          $project: {
            village: 1,
            billAmount: 1,
            unpaidCount: {
              $size: {
                $filter: {
                  input: "$payments",
                  as: "payment",
                  cond: { $eq: ["$$payment.status", "unpaid"] },
                },
              },
            },
          },
        },
        {
          $group: {
            _id: "$village",
            customers: { $sum: 1 },
            totalDue: {
              $sum: { $multiply: ["$billAmount", "$unpaidCount"] },
            },
          },
        },
      ]),
    ]);

    // Format village summary
    const villageSummary = {};
    villageSummaryResult.forEach((item) => {
      villageSummary[item._id] = {
        customers: item.customers,
        totalDue: item.totalDue || 0,
      };
    });

    return NextResponse.json(
      {
        totalCustomers,
        totalDue: totalDueResult[0]?.totalDue || 0,
        totalCollectedThisMonth: currentMonthResult,
        last6Months: last6MonthsResult,
        villageSummary,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=59',
        },
      }
    );
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

