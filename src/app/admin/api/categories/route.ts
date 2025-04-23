import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbconnect';
import Category from '@/models/Category';

export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Fetch all categories from the database
    const categories = await Category.find().sort({ order: 1 });
    
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

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { success: false, error: 'Name and slug are required fields' },
        { status: 400 }
      );
    }
    
    // Check if a category with the same slug already exists
    const existingCategory = await Category.findOne({ slug: body.slug });
    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: 'A category with this slug already exists' },
        { status: 409 }
      );
    }
    
    // Create a new category with the request data
    const newCategory = await Category.create({
      name: body.name,
      slug: body.slug,
      description: body.description || '',
      image: body.image || '',
      order: body.order || 0,
      active: typeof body.active === 'boolean' ? body.active : true,
    });
    
    // Return the newly created category
    return NextResponse.json({ 
      success: true, 
      message: 'Category created successfully', 
      category: newCategory 
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}