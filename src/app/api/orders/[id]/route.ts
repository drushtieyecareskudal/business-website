import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbconnect";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { OrderInterface } from "@/models/Order";

// TypeScript utility types for API responses
interface ApiSuccessResponse<T> {
  success: true;
  order?: T;
}

interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
}

// Define interfaces for JWT token
interface DecodedToken {
  id: string;
  [key: string]: unknown;
}

// Helper function to get user ID from token
const getUserId = async (): Promise<string | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as DecodedToken;
    return decoded.id;
  } catch {
    return null;
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    const {id} = await params;
  try {
    console.log(`GET /api/orders/${id} - Fetching order details`);
    const userId = await getUserId();
    console.log("User ID from token:", userId);

    if (!userId) {
      console.log("Authentication failed - no user ID from token");
      return NextResponse.json(
        { success: false, message: "Unauthorized" } as ApiErrorResponse,
        { status: 401 }
      );
    }
    
    await dbConnect();
    console.log("Looking for order with ID:", id);

    const order = await Order.findById(id).populate({
      path: "items.product",
      model: Product,
      select: "name slug images price discountedPrice",
    }) as OrderInterface | null;

    console.log("Order found:", order ? "Yes" : "No");

    // Verify that the order belongs to the logged-in user
    if (!order) {
      console.log("Order not found");
      return NextResponse.json(
        { success: false, message: "Order not found" } as ApiErrorResponse,
        { status: 404 }
      );
    }

    console.log("Order user ID:", order.user.toString());
    console.log("Current user ID:", userId);
    
    if (order.user.toString() !== userId) {
      console.log("Order belongs to a different user");
      return NextResponse.json(
        { success: false, message: "Order not found" } as ApiErrorResponse,
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order } as ApiSuccessResponse<OrderInterface>);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Error fetching order", 
        error: errorMessage 
      } as ApiErrorResponse,
      { status: 500 }
    );
  }
}
