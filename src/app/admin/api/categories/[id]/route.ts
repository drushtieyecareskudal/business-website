import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbconnect";
import Category from "@/models/Category";
import Product from "@/models/Product";

// DELETE /admin/api/categories/[id] - Delete a category and all its products
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await dbConnect();

    // Check if category exists
    console.warn(`id: ${id}`)
    const category = await Category.findById(id);
    
    if (!category) {
      return NextResponse.json({
        success: false,
        error: "Category not found",
      }, { status: 404 });
    }

    // Delete all products under this category first
    const deletedProducts = await Product.deleteMany({ category: id });
    
    // Delete the category
    await Category.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: `Category deleted successfully. ${deletedProducts.deletedCount} product(s) were also removed.`,
      deletedProductsCount: deletedProducts.deletedCount,
    });

  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to delete category",
    }, { status: 500 });
  }
}

// PUT /admin/api/categories/[id] - Update a category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    await dbConnect();

    // Check if category exists
    const existingCategory = await Category.findById(id);
    
    if (!existingCategory) {
      return NextResponse.json({
        success: false,
        error: "Category not found",
      }, { status: 404 });
    }

    // If slug is being updated, check for duplicates
    if (body.slug && body.slug !== existingCategory.slug) {
      const duplicateSlug = await Category.findOne({ 
        slug: body.slug, 
        _id: { $ne: id } 
      });
      
      if (duplicateSlug) {
        return NextResponse.json({
          success: false,
          error: "A category with this slug already exists",
        }, { status: 409 });
      }
    }

    // Update the category
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      category: updatedCategory,
    });

  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to update category",
    }, { status: 500 });
  }
}

// GET /admin/api/categories/[id] - Get a single category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await dbConnect();

    const category = await Category.findById(id);
    
    if (!category) {
      return NextResponse.json({
        success: false,
        error: "Category not found",
      }, { status: 404 });
    }

    // Get count of products in this category
    const productCount = await Product.countDocuments({ category: id });

    return NextResponse.json({
      success: true,
      category,
      productCount,
    });

  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch category",
    }, { status: 500 });
  }
}
