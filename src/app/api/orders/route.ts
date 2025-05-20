import Order from "@/models/Order";
import Product from "@/models/Product";
import dbConnect from "@/utils/dbconnect";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Helper function to get user ID from token
const getUserId = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    if (typeof decoded === "string") {
      return null;
    }
    return (decoded as { id: string }).id;
  } catch {
    return null;
  }
};

export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/orders - Starting order creation");
    const userId = await getUserId();
    console.log("User ID from token:", userId);

    if (!userId) {
      console.log("Authentication failed - no user ID from token");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    await dbConnect();
    console.log("Database connected");

    const requestBody = await request.json();
    console.log("Request body:", JSON.stringify(requestBody));

    const { shippingAddress, paymentMethod, items, totalAmount } = requestBody;

    // Validate required fields
    if (!shippingAddress || !paymentMethod || !items || !totalAmount) {
      console.log("Missing required fields:", {
        hasShippingAddress: !!shippingAddress,
        hasPaymentMethod: !!paymentMethod,
        hasItems: !!items,
        hasTotalAmount: !!totalAmount,
      });
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    } // Create order
    console.log("Creating order with data:", {
      userId,
      itemsCount: items.length,
      totalAmount,
      paymentMethod,
    });

    try {
      const order = new Order({
        user: userId,
        items,
        totalAmount,
        shippingAddress,
        paymentMethod,
        paymentStatus: "paid", // Since we're simulating payment, mark as paid
        status: "processing", // Initial status
      });

      console.log("Order model created, saving...");
      await order.save();
      console.log("Order saved with ID:", order._id);

      // Populate product info for response
      try {
        const populatedOrder = await Order.findById(order._id).populate({
          path: "items.product",
          model: Product,
          select: "name slug images",
        });
        console.log("Order populated successfully");
        return NextResponse.json(
          { success: true, order: populatedOrder },
          { status: 201 }
        );
      } catch (populateError) {
        console.error("Error populating order:", populateError);
        return NextResponse.json(
          { success: true, order: order },
          { status: 201 }
        );
      }
    } catch (saveError) {
      console.error("Error saving order:", saveError);
      return NextResponse.json(
        {
          success: false,
          message: "Error saving order",
          error: saveError instanceof Error ? saveError.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, message: "Error creating order", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log("GET /api/orders - Fetching all orders");
    const userId = await getUserId();
    console.log("User ID from token:", userId);

    if (!userId) {
      console.log("Authentication failed - no user ID from token");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    await dbConnect();
    console.log("Database connected");

    try {
      const orders = await Order.find({ user: userId })
        .populate({
          path: "items.product",
          model: Product,
          select: "name slug images",
        })
        .sort({ createdAt: -1 });

      console.log(`Found ${orders.length} orders for user`);
      return NextResponse.json({ success: true, orders });
    } catch (findError) {
      console.error("Error fetching orders:", findError);
      return NextResponse.json(
        {
          success: false,
          message: "Error fetching orders",
          error: findError instanceof Error ? findError.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching orders",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
