import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbconnect";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    // Connect to the database
    await dbConnect();

    // Get the token from cookies
    const token = req.cookies.get("token")?.value;

    // Check if token exists
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify the token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

      // Check if user is an admin
      if (decoded.role !== "admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Fetch all orders with populated references
    const orders = await Order.find({})
      .populate({
        path: "user",
        select: "name email",
      })
      .populate({
        path: "items.product",
        select: "name images",
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
