import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbconnect';
import Product from '@/models/Product';
import Category from '@/models/Category';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const prod_id = (await params).id;
  try {
    await dbConnect();
    
    // Find product by ID and populate category
    const product = await Product.findById(prod_id).populate('category');
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      product 
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const prod_id = (await params).id;
    const data = await request.json();
    
    // Check if category exists and get its ID if it's provided as a slug
    if (data.category && typeof data.category === 'string' && !data.category.match(/^[0-9a-fA-F]{24}$/)) {
      const category = await Category.findOne({ slug: data.category });
      if (!category) {
        return NextResponse.json(
          { success: false, error: 'Category not found' },
          { status: 404 }
        );
      }
      data.category = category._id;
    }
    
    // Find and update product
    const product = await Product.findByIdAndUpdate(
      prod_id,
      data,
      { new: true, runValidators: true }
    ).populate('category');
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      product 
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    // Find and delete product
    const product = await Product.findByIdAndDelete(params.id);
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Product deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}