import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get file extension
    const originalFilename = file.name;
    const fileExtension = path.extname(originalFilename);

    // Generate unique filename
    const uniqueFilename = `${uuidv4()}${fileExtension}`;

    // Define upload path
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, uniqueFilename);

    // Write file to disk
    await writeFile(filePath, buffer);

    // Return the file path that can be stored in the database
    return NextResponse.json(
      {
        success: true,
        filePath: `/uploads/${uniqueFilename}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
