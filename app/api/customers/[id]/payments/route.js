import connectMongoDB from "@/libs/mongodb";
import Payment from "@/models/payment";
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
    const payments = await Payment.find({ customerId: id }).sort({ month: -1 });

    return NextResponse.json({ payments }, { status: 200 });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const authResult = adminAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { id } = params;
    const { month, status, transactionId } = await request.json();

    if (!month) {
      return NextResponse.json(
        { error: "Month is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();
    
    // Check if payment already exists
    let payment = await Payment.findOne({ customerId: id, month });

    if (payment) {
      // Update existing payment
      payment.status = status || payment.status;
      payment.transactionId = transactionId || payment.transactionId;
      if (status === "paid") {
        payment.paidAt = new Date();
        payment.verifiedByAdmin = true;
      }
      await payment.save();
    } else {
      // Create new payment
      payment = await Payment.create({
        customerId: id,
        month,
        status: status || "unpaid",
        transactionId: transactionId || "",
        paidAt: status === "paid" ? new Date() : null,
        verifiedByAdmin: status === "paid",
      });
    }

    return NextResponse.json(
      { message: "Payment updated", payment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating payment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

