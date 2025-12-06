import connectMongoDB from "@/libs/mongodb";
import Admin from "@/models/admin";
import { verifyToken } from "@/libs/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Verify reset token
    const decoded = verifyToken(token);
    
    if (!decoded || decoded.type !== "password-reset") {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 401 }
      );
    }

    await connectMongoDB();
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return NextResponse.json(
        { error: "Admin not found" },
        { status: 404 }
      );
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

