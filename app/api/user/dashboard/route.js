import connectMongoDB from "@/libs/mongodb";
import Payment from "@/models/payment";
import Customer from "@/models/customer";
import { verifyToken, getTokenFromRequest } from "@/libs/auth";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    
    if (!decoded || decoded.role !== "user") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const customerId = decoded.customerId || decoded.id;
    await connectMongoDB();

    // Run queries in parallel
    const [customer, allPayments] = await Promise.all([
      Customer.findById(customerId).select("name phone village billAmount").lean(),
      Payment.find({ customerId })
        .select("month status paidAt")
        .sort({ month: -1 })
        .lean(),
    ]);

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // Calculate total due
    const unpaidPayments = allPayments.filter((p) => p.status === "unpaid");
    const totalDue = unpaidPayments.length * (customer.billAmount || 0);

    // Last 6 months
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

    return NextResponse.json(
      {
        customer: {
          id: customer._id,
          name: customer.name,
          phone: customer.phone,
          village: customer.village,
          billAmount: customer.billAmount,
        },
        totalDue,
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
    console.error("Error fetching user dashboard:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

