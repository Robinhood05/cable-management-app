import connectMongoDB from "@/libs/mongodb";
import PaymentRequest from "@/models/paymentRequest";
import Customer from "@/models/customer";
import { adminAuth } from "@/libs/middleware";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const authResult = adminAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const verified = searchParams.get("verified");

    let query = {};
    if (verified !== null) {
      query.verified = verified === "true";
    }

    const paymentRequests = await PaymentRequest.find(query)
      .select("name phone village customerId transactionId month amount screenshotURL verified createdAt")
      .sort({ createdAt: -1 })
      .populate("customerId", "name phone village")
      .lean()
      .limit(100); // Limit to prevent huge responses

    return NextResponse.json(
      { paymentRequests }, 
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=10',
        }
      }
    );
  } catch (error) {
    console.error("Error fetching payment requests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { name, phone, village, transactionId, month, amount, screenshotURL } = await request.json();

    if (!name || !phone || !village || !transactionId || !month || !amount) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Try to find customer
    const customer = await Customer.findOne({
      name: { $regex: new RegExp(name, "i") },
      phone: phone,
      village: { $regex: new RegExp(village, "i") },
    });

    const paymentRequest = await PaymentRequest.create({
      name,
      phone,
      village,
      customerId: customer?._id || null,
      transactionId,
      month,
      amount,
      screenshotURL: screenshotURL || "",
      verified: false,
    });

    return NextResponse.json(
      { message: "Payment request submitted", paymentRequest },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating payment request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

