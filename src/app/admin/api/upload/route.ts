import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { existsSync, mkdirSync } from "fs";

// Helper function to validate file size (10MB limit)
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

// Simple auth check for admin API
function checkAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return false;
  }

  try {
    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
    const [username, password] = credentials.split(":");
    
    // Simple hardcoded check - in production, use proper auth
    return username === "admin" && password === "admin123";
  } catch {
    return false;
  }
}

// Handle image uploads for products
export async function POST(request: NextRequest) {
  try {
    console.log("Upload API called");
    
    // Check authentication
    if (!checkAuth(request)) {
      return NextResponse.json({
        success: false,
        error: "Unauthorized",
      }, { status: 401 });
    }
    
    // Parse the form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    console.log("File received:", file?.name, file?.size, file?.type);

    if (!file) {
      console.error("No file provided");
      return NextResponse.json({
        success: false,
        error: "No file was provided",
      }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      console.error("File too large:", file.size);
      return NextResponse.json({
        success: false,
        error: "File size must be less than 10MB",
      }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      console.error("Invalid file type:", file.type);
      return NextResponse.json({
        success: false,
        error: "Only JPEG, JPG, PNG, and WebP images are allowed",
      }, { status: 400 });
    }

    // Get file extension
    const fileExt = file.name.split(".").pop() || "jpg";
    
    // Create a unique filename
    const fileName = `${uuidv4()}.${fileExt}`;
    
    // Get file bytes
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join("/public", "uploads");
    if (!existsSync(uploadDir)) {
      console.log("Creating uploads directory:", uploadDir);
      mkdirSync(uploadDir, { recursive: true });
    }
    
    // Save the file
    const filePath = path.join(uploadDir, fileName);
    console.log("Saving file to:", filePath);
    await writeFile(filePath, buffer);

    // Return the image URL
    const imageUrl = `/uploads/${fileName}`;
    console.log("File uploaded successfully:", imageUrl);

    return NextResponse.json({
      success: true,
      imageUrl,
    });

  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload file",
    }, { status: 500 });
  }
}
