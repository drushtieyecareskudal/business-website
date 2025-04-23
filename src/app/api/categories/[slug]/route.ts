import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbconnect';
import Category from '@/models/Category';
import Product from '@/models/Product';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Extract the slug from the params
    const { slug } = (await params);
    
    // Find the category by slug
    const category = await Category.findOne({ slug });
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Find all products that belong to this category
    const products = await Product.find({ category: category._id });
    
    // Return the category and its products
    return NextResponse.json({ 
      success: true,
      category,
      products,
      count: products.length
    });
  } catch (error) {
    console.error('Error retrieving products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve products' },
      { status: 500 }
    );
  }
}