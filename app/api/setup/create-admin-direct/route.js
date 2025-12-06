// Direct route to create admin with specific credentials
// This should be disabled in production after creating the admin

import connectMongoDB from "@/libs/mongodb";
import Admin from "@/models/admin";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectMongoDB();

    const email = "sujonhasan2014@gmail.com";
    const password = "({[qwert12345@#]})";
    const name = "Admin";

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      // Update existing admin
      existingAdmin.password = password;
      existingAdmin.name = name;
      await existingAdmin.save();
      
      return NextResponse.json(
        {
          message: "Admin password updated successfully",
          admin: {
            id: existingAdmin._id,
            email: existingAdmin.email,
            name: existingAdmin.name,
          },
        },
        { status: 200 }
      );
    }

    // Create new admin
    const admin = await Admin.create({
      email,
      password,
      name,
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
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

