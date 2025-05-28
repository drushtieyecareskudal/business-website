import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbconnect";
import Product from "@/models/Product";
import mongoose from "mongoose";

// Helper function to check if a string is a valid ObjectId
function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({
        success: false,
        error: "Invalid product ID",
      }, { status: 400 });
    }

    const product = await Product.findById(id).populate("category", "name slug");

    if (!product) {
      return NextResponse.json({
        success: false,
        error: "Product not found",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      product,
    });

  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch product",
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({
        success: false,
        error: "Invalid product ID",
      }, { status: 400 });
    }

    const body = await request.json();

    // Basic validation
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields: name, price, or category",
      }, { status: 400 });
    }

    // Check if slug is being updated and if it's already taken
    if (body.slug) {
      const existingProduct = await Product.findOne({
        slug: body.slug,
        _id: { $ne: id }, // Exclude the current product
      });

      if (existingProduct) {
        return NextResponse.json({
          success: false,
          error: "A product with this slug already exists",
        }, { status: 409 });
      }
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    ).populate("category", "name slug");

    if (!updatedProduct) {
      return NextResponse.json({
        success: false,
        error: "Product not found",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      product: updatedProduct,
    });

  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to update product",
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({
        success: false,
        error: "Invalid product ID",
      }, { status: 400 });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({
        success: false,
        error: "Product not found",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to delete product",
    }, { status: 500 });
  }
}
