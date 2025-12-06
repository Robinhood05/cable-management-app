import connectMongoDB from "@/libs/mongodb";
import Payment from "@/models/payment";
import Customer from "@/models/customer";
import { adminAuth } from "@/libs/middleware";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const authResult = adminAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { id } = params;
    await connectMongoDB();

    // Run queries in parallel
    const [customer, allPayments] = await Promise.all([
      Customer.findById(id).select("billAmount").lean(),
      Payment.find({ customerId: id })
        .select("month status paidAt")
        .sort({ month: -1 })
        .lean(),
    ]);

    const billAmount = customer?.billAmount || 0;
    const unpaidCount = allPayments.filter((p) => p.status === "unpaid").length;
    const totalDue = unpaidCount * billAmount;

    // Get last 6 months data
    const last6Months = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const payment = allPayments.find((p) => p.month === monthStr);
      last6Months.push({
        month: monthStr,
        status: payment?.status || "unpaid",
        paidAt: payment?.paidAt || null,
      });
    }

    // Calculate total collected
    const totalCollected = allPayments.filter((p) => p.status === "paid").length;

    return NextResponse.json(
      {
        totalDue,
        totalCollected,
        last6Months,
        allPayments,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
        }
      }
    );
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

