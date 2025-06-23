import { NextRequest, NextResponse } from "next/server";

// Simple test endpoint to check if the upload API is accessible
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: "Upload API is accessible",
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({
      success: false,
      error: "Test failed",
    }, { status: 500 });
  }
}

// Test POST endpoint that mimics upload
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    
    return NextResponse.json({
      success: true,
      message: "POST test successful",
      authHeader: authHeader ? "Present" : "Missing",
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({
      success: false,
      error: "POST test failed",
    }, { status: 500 });
  }
}
