import connectMongoDB from "@/libs/mongodb";
import Payment from "@/models/payment";
import Customer from "@/models/customer";
import { adminAuth } from "@/libs/middleware";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const authResult = adminAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { customerId, month, status } = await request.json();

    if (!customerId || !month) {
      return NextResponse.json(
        { error: "Customer ID and month are required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    let payment = await Payment.findOne({ customerId, month });

    if (payment) {
      payment.status = status;
      if (status === "paid") {
        payment.paidAt = new Date();
        payment.verifiedByAdmin = true;
      }
      await payment.save();
    } else {
      payment = await Payment.create({
        customerId,
        month,
        status: status || "unpaid",
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

