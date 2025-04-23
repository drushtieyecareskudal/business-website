import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbconnect";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";

export async function PATCH(req, { params }) {
  try {
    // Connect to the database
    await dbConnect();

    // Get the order ID from the URL params
    const orderId = params.orderId;

    // Get the admin session
    const session = await getServerSession();

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const body = await req.json();
    const { status } = body;

    // Validate the status
    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      );
    }

    // Find and update the order
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Update the order status
    order.status = status;
    order.updatedAt = Date.now();

    // Save the updated order
    await order.save();

    return NextResponse.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
