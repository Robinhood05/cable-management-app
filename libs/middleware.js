import { verifyToken, getTokenFromRequest } from "./auth";
import { NextResponse } from "next/server";

export function adminAuth(request) {
  const token = getTokenFromRequest(request);
  
  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized - No token provided" },
      { status: 401 }
    );
  }

  const decoded = verifyToken(token);
  
  if (!decoded || decoded.role !== "admin") {
    return NextResponse.json(
      { error: "Unauthorized - Invalid token" },
      { status: 401 }
    );
  }

  return decoded;
}

