import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbconnect";
import Category from "@/models/Category";

// GET /admin/api/categories - Get all categories
export async function GET() {
  try {
    await dbConnect();
    
    const categories = await Category.find({}).sort({ name: 1 });

    return NextResponse.json({
      success: true,
      categories,
    });

  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch categories",
    }, { status: 500 });
  }
}

// POST /admin/api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();

    // Basic validation
    if (!body.name || !body.slug) {
      return NextResponse.json({
        success: false,
        error: "Name and slug are required",
      }, { status: 400 });
    }

    // Check if category with the same slug already exists
    const existingCategory = await Category.findOne({ slug: body.slug });

    if (existingCategory) {
      return NextResponse.json({
        success: false,
        error: "A category with this slug already exists",
      }, { status: 409 });
    }

    // Create a new category
    const category = new Category(body);
    await category.save();

    return NextResponse.json({
      success: true,
      category,
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to create category",
    }, { status: 500 });
  }
}
