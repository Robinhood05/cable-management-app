import connectMongoDB from "@/libs/mongodb";
import Admin from "@/models/admin";
import { generateToken } from "@/libs/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectMongoDB();
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = generateToken({ 
      id: admin._id, 
      email: admin.email, 
      role: "admin" 
    });

    return NextResponse.json(
      { 
        message: "Login successful",
        token,
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

