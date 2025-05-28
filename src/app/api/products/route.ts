import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbconnect';
import Product from '@/models/Product';

export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Get URL search parameters
    const searchParams = request.nextUrl.searchParams;
      // Build query object
    const query: Record<string, unknown> = {};
    // Filter by category if provided
    const categoryId = searchParams.get('category');
    if (categoryId) {
      query.category = categoryId;
    }
    
    // Filter by best seller
    const bestSeller = searchParams.get('bestSeller');
    if (bestSeller === 'true') {
      query.bestSeller = true;
    }
    
    // Filter by in stock
    const inStock = searchParams.get('inStock');
    if (inStock === 'true') {
      query.inStock = true;
    }
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Execute query with pagination
    // const products = await Product.find(query)
    const products = await Product.find()
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit)
      .populate('category', 'name slug'); // Populate the category field with name and slug only
    
    // Get total count for pagination
    const totalProducts = await Product.countDocuments(query);
    
    // Return products with pagination info
    return NextResponse.json({
      success: true,
      products,
      pagination: {
        total: totalProducts,
        page,
        limit,
        pages: Math.ceil(totalProducts / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}