import connectMongoDB from "@/libs/mongodb";
import Admin from "@/models/admin";
import { generateToken } from "@/libs/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();
    const admin = await Admin.findOne({ email });

    if (!admin) {
      // Don't reveal if email exists for security
      return NextResponse.json(
        { message: "If the email exists, a password reset link has been sent" },
        { status: 200 }
      );
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = generateToken({ 
      id: admin._id, 
      email: admin.email, 
      type: "password-reset" 
    });

    // In a real application, you would send this token via email
    // For now, we'll return it (in production, send via email)
    return NextResponse.json(
      { 
        message: "Password reset token generated",
        resetToken: resetToken, // Remove this in production and send via email
        // In production, send email with reset link like:
        // `${process.env.APP_URL}/admin/reset-password?token=${resetToken}`
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in forgot password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

