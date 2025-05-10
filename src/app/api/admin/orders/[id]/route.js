import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbconnect";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "admin") {
      return new NextResponse(
        JSON.stringify({ message: "Unauthorized. Admin access required." }),
        { status: 403 }
      );
    }

    await dbConnect();

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

    // Get the admin session
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session || !session.user || !session.user.isAdmin) {
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
