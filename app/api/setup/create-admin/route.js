// One-time setup route to create admin user
// This should be disabled in production after creating the admin

import connectMongoDB from "@/libs/mongodb";
import Admin from "@/models/admin";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // In production, you should add additional security checks here
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin already exists with this email" },
        { status: 400 }
      );
    }

    // Create admin
    const admin = await Admin.create({
      email,
      password,
      name: name || "Admin",
    });

    return NextResponse.json(
      {
        message: "Admin created successfully",
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

