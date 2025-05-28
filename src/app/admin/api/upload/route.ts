import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { existsSync, mkdirSync } from "fs";

// Handle image uploads for products
export async function POST(request: NextRequest) {
  try {
    // Parse the form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({
        success: false,
        error: "No file was provided",
      }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: "Only JPEG, JPG, PNG, and WebP images are allowed",
      }, { status: 400 });
    }

    // Get file extension
    const fileExt = file.name.split(".").pop();
    
    // Create a unique filename
    const fileName = `${uuidv4()}.${fileExt}`;
    
    // Get file bytes
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }
    
    // Save the file
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // Return the image URL
    const imageUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      imageUrl,
    });

  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to upload file",
    }, { status: 500 });
  }
}
