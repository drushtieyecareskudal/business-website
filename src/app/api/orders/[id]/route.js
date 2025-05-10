import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbconnect";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    await dbConnect();

    const id = (await params).id;

    const order = await Order.findById(id).populate({
      path: "items.product",
      model: Product,
      select: "name slug images price discountedPrice",
    });

    // Verify that the order belongs to the logged-in user
    if (!order || order.user.toString() !== session.user.id) {
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
