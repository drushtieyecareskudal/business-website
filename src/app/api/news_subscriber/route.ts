import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbconnect";
import NewsSubscriber from "@/models/NewsSubscriber";

// Connect to database
dbConnect();

// GET route to fetch all news subscribers
export async function GET() {
  try {
    const subscribers = await NewsSubscriber.find({});
    return NextResponse.json(
      { success: true, subscribers },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching news subscribers:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}

// POST route to add a new subscriber
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }
    
    // Check if subscriber already exists
    const existingSubscriber = await NewsSubscriber.findOne({ email });
    
    if (existingSubscriber) {
      return NextResponse.json(
        { success: false, message: "Email already subscribed" },
        { status: 409 }
      );
    }
    
    // Create new subscriber
    const newSubscriber = await NewsSubscriber.create({ email });
    
    return NextResponse.json(
      { 
        success: true, 
        message: "Successfully subscribed to newsletter",
        subscriber: newSubscriber 
      },
      { status: 201 }
    );
      } catch (error) {
    console.error("Error adding subscriber:", error);
      // Handle validation errors from Mongoose
    if (error && typeof error === 'object' && 'name' in error && error.name === "ValidationError" && 'message' in error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: "Failed to subscribe" },
      { status: 500 }
    );
  }
}