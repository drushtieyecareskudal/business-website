import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Order from "@/models/Order";
import Product from "@/models/Product";
import dbConnect from "@/utils/dbconnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    await dbConnect();

    const { shippingAddress, paymentMethod, items, totalAmount } =
      await request.json();

    // Validate required fields
    if (!shippingAddress || !paymentMethod || !items || !totalAmount) {
      return new NextResponse(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Create order
    const order = new Order({
      user: session.user.id,
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

    return new NextResponse(JSON.stringify(populatedOrder), { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return new NextResponse(
      JSON.stringify({ message: "Error creating order", error: error.message }),
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    await dbConnect();

    const orders = await Order.find({ user: session.user.id })
      .populate({
        path: "items.product",
        model: Product,
        select: "name slug images",
      })
      .sort({ createdAt: -1 });

    return new NextResponse(JSON.stringify(orders));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Error fetching orders",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
