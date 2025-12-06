import connectMongoDB from "@/libs/mongodb";
import Customer from "@/models/customer";
import { generateToken } from "@/libs/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, phone, village } = await request.json();

    if (!name || !phone || !village) {
      return NextResponse.json(
        { error: "Name, phone, and village are required" },
        { status: 400 }
      );
    }

    await connectMongoDB();
    
    // Find customer by name, phone, and village
    const customer = await Customer.findOne({
      name: { $regex: new RegExp(name, "i") },
      phone: phone,
      village: { $regex: new RegExp(village, "i") },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found. Please check your details." },
        { status: 404 }
      );
    }

    const token = generateToken({ 
      id: customer._id, 
      role: "user",
      customerId: customer._id,
    });

    return NextResponse.json(
      { 
        message: "Login successful",
        token,
        customer: {
          id: customer._id,
          name: customer.name,
          phone: customer.phone,
          village: customer.village,
          billAmount: customer.billAmount,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("User login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

