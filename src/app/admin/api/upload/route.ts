import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

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
        const credentials = Buffer.from(base64Credentials, "base64").toString(
            "ascii"
        );
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
            return NextResponse.json(
                {
                    success: false,
                    error: "Unauthorized",
                },
                { status: 401 }
            );
        }

        // Parse the form data
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        console.log("File received:", file?.name, file?.size, file?.type);

        if (!file) {
            console.error("No file provided");
            return NextResponse.json(
                {
                    success: false,
                    error: "No file was provided",
                },
                { status: 400 }
            );
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            console.error("File too large:", file.size);
            return NextResponse.json(
                {
                    success: false,
                    error: "File size must be less than 10MB",
                },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/webp",
        ];
        if (!allowedTypes.includes(file.type)) {
            console.error("Invalid file type:", file.type);
            return NextResponse.json(
                {
                    success: false,
                    error: "Only JPEG, JPG, PNG, and WebP images are allowed",
                },
                { status: 400 }
            );
        }

        // Get file bytes
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure Cloudinary is configured via environment variables
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (!cloudName || !apiKey || !apiSecret) {
            console.error("Cloudinary credentials are not configured");
            return NextResponse.json(
                {
                    success: false,
                    error: "Cloudinary credentials are not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in environment.",
                },
                { status: 500 }
            );
        }

        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
            secure: true,
        });

        // Upload using a data URI (no intermediate file)
        const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

        try {
            const uploadResult = await cloudinary.uploader.upload(dataUri, {
                folder: "drushti_eye_care",
                resource_type: "image",
            });

            const imageUrl = uploadResult.secure_url || uploadResult.url;
            console.log("File uploaded to Cloudinary:", imageUrl);

            return NextResponse.json({ success: true, imageUrl });
        } catch (uploadErr) {
            console.error("Cloudinary upload error:", uploadErr);
            return NextResponse.json(
                {
                    success: false,
                    error:
                        uploadErr instanceof Error
                            ? uploadErr.message
                            : String(uploadErr),
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to upload file",
            },
            { status: 500 }
        );
    }
}
