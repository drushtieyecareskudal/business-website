import Order from "@/models/Order";
import Product from "@/models/Product";
import dbConnect from "@/utils/dbconnect";
import { NextResponse } from "next/server";
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
    return decoded.id;
  } catch {
    return null;
  }
};

export async function POST(request) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const { shippingAddress, paymentMethod, items, totalAmount } =
      await request.json(); // Validate required fields
    if (!shippingAddress || !paymentMethod || !items || !totalAmount) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    } // Create order
    const order = new Order({
      user: userId,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: "paid", // Since we're simulating payment, mark as paid
      status: "processing", // Initial status
    });

    await order.save();

    // Populate product info for response
    const populatedOrder = await Order.findById(order._id).populate({
      path: "items.product",
      model: Product,
      select: "name slug images",
    });
    return NextResponse.json(populatedOrder, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, message: "Error creating order", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const orders = await Order.find({ user: userId })
      .populate({
        path: "items.product",
        model: Product,
        select: "name slug images",
      })
      .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching orders",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
