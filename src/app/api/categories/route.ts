import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbconnect';
import Category from '@/models/Category';

export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Fetch all categories from the database
    const categories = await Category.find({ active: true }).sort({ order: 1 });
    
    // Return the categories as JSON response
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}