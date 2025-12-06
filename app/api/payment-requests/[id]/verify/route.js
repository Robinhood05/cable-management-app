import connectMongoDB from "@/libs/mongodb";
import PaymentRequest from "@/models/paymentRequest";
import Payment from "@/models/payment";
import Customer from "@/models/customer";
import { adminAuth } from "@/libs/middleware";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    const authResult = adminAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { id } = params;
    const { action } = await request.json(); // "approve" or "reject"

    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Action must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    await connectMongoDB();
    const paymentRequest = await PaymentRequest.findById(id);

    if (!paymentRequest) {
      return NextResponse.json(
        { error: "Payment request not found" },
        { status: 404 }
      );
    }

    if (action === "approve") {
      paymentRequest.verified = true;
      paymentRequest.verifiedBy = authResult.id;
      paymentRequest.verifiedAt = new Date();

      // Find or create customer
      let customer = paymentRequest.customerId;
      if (!customer) {
        customer = await Customer.findOne({
          name: { $regex: new RegExp(paymentRequest.name, "i") },
          phone: paymentRequest.phone,
          village: { $regex: new RegExp(paymentRequest.village, "i") },
        });

        if (!customer) {
          // Create customer if doesn't exist
          customer = await Customer.create({
            name: paymentRequest.name,
            phone: paymentRequest.phone,
            village: paymentRequest.village,
            billAmount: paymentRequest.amount,
          });
        }
        paymentRequest.customerId = customer._id;
      }

      // Mark payment as paid
      let payment = await Payment.findOne({
        customerId: customer._id,
        month: paymentRequest.month,
      });

      if (payment) {
        payment.status = "paid";
        payment.paidAt = new Date();
        payment.transactionId = paymentRequest.transactionId;
        payment.verifiedByAdmin = true;
        await payment.save();
      } else {
        await Payment.create({
          customerId: customer._id,
          month: paymentRequest.month,
          status: "paid",
          paidAt: new Date(),
          transactionId: paymentRequest.transactionId,
          verifiedByAdmin: true,
        });
      }
    } else {
      paymentRequest.verified = false;
    }

    await paymentRequest.save();

    return NextResponse.json(
      { 
        message: `Payment request ${action === "approve" ? "approved" : "rejected"}`,
        paymentRequest 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying payment request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

