import connectMongoDB from "@/libs/mongodb";
import Customer from "@/models/customer";
import Payment from "@/models/payment";
import { adminAuth } from "@/libs/middleware";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const authResult = adminAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response
    }

    await connectMongoDB();
    
    // Get customers with their unpaid payment counts using aggregation
    const customersWithDue = await Customer.aggregate([
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
          name: 1,
          phone: 1,
          village: 1,
          billAmount: 1,
          createdAt: 1,
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
        $addFields: {
          totalDue: { $multiply: ["$billAmount", "$unpaidCount"] },
        },
      },
      {
        $sort: { village: 1, totalDue: -1, name: 1 },
      },
    ]);

    // Convert to plain objects (lean equivalent)
    const customers = customersWithDue.map((customer) => ({
      _id: customer._id,
      name: customer.name,
      phone: customer.phone || "",
      village: customer.village,
      billAmount: customer.billAmount || 0,
      totalDue: customer.totalDue || 0,
      createdAt: customer.createdAt,
    }));
    
    return NextResponse.json(
      { customers }, 
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59',
        }
      }
    );
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authResult = adminAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { name, phone, village, billAmount } = await request.json();

    if (!name || !village) {
      return NextResponse.json(
        { error: "Name and village are required" },
        { status: 400 }
      );
    }

    await connectMongoDB();
    const customer = await Customer.create({
      name,
      phone: phone || "",
      village,
      billAmount: billAmount || 0,
    });

    return NextResponse.json(
      { message: "Customer created", customer },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

