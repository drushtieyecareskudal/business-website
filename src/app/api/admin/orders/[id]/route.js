import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbconnect";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Helper function to get authenticated admin user
const getAuthenticatedAdmin = async () => {
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

    // Find user and check if admin
    const user = await User.findById(decoded.id);
    if (!user || user.role !== "admin") {
      return null;
    }

    return user;
  } catch {
    return null;
  }
};

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const admin = await getAuthenticatedAdmin();

    if (!admin) {
      return new NextResponse(
        JSON.stringify({ message: "Unauthorized. Admin access required." }),
        { status: 403 }
      );
    }

    const orderId = params.id;

    const order = await Order.findById(orderId)
      .populate({
        path: "user",
        model: User,
        select: "name email",
      })
      .populate({
        path: "items.product",
        model: Product,
        select: "name slug images price discountedPrice",
      });

    if (!order) {
      return new NextResponse(JSON.stringify({ message: "Order not found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(order));
  } catch (error) {
    console.error("Error fetching order:", error);
    return new NextResponse(
      JSON.stringify({ message: "Error fetching order", error: error.message }),
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    // Connect to the database
    await dbConnect();

    // Get the order ID from the URL params
    const orderId = params.id;

    // Check if user is authenticated and is an admin
    const admin = await getAuthenticatedAdmin();

    if (!admin) {
      return new NextResponse(
        JSON.stringify({ message: "Unauthorized. Admin access required." }),
        { status: 403 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { status, paymentStatus } = body;

    // Find the order
    const order = await Order.findById(orderId);

    if (!order) {
      return new NextResponse(JSON.stringify({ message: "Order not found" }), {
        status: 404,
      });
    }

    // Update the order fields if provided
    if (status) {
      const validStatuses = [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ];

      if (!validStatuses.includes(status)) {
        return new NextResponse(
          JSON.stringify({ message: "Invalid status value" }),
          { status: 400 }
        );
      }

      order.status = status;
    }

    if (paymentStatus) {
      const validPaymentStatuses = ["pending", "paid", "failed"];

      if (!validPaymentStatuses.includes(paymentStatus)) {
        return new NextResponse(
          JSON.stringify({ message: "Invalid payment status value" }),
          { status: 400 }
        );
      }

      order.paymentStatus = paymentStatus;
    }

    order.updatedAt = new Date();

    // Save the updated order
    await order.save();

    // Return the updated order
    return new NextResponse(JSON.stringify(order));
  } catch (error) {
    console.error("Error updating order:", error);
    return new NextResponse(
      JSON.stringify({ message: "Error updating order", error: error.message }),
      { status: 500 }
    );
  }
}
