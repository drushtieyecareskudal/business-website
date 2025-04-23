import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbconnect';
import Product from '@/models/Product';
import Category from '@/models/Category';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get all products with populated category
    const products = await Product.find().populate('category').sort('-createdAt');
    
    return NextResponse.json({ 
      success: true, 
      products 
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Parse request body
    const data = await request.json();
    
    // Debug logging
    console.log('Product data received:', data);
    
    // Ensure slug exists
    if (!data.slug) {
      return NextResponse.json(
        { success: false, error: 'Product slug is required' },
        { status: 400 }
      );
    }
    
    // Check if a product with this slug already exists
    const existingProduct = await Product.findOne({ slug: data.slug });
    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: 'A product with this slug already exists' },
        { status: 400 }
      );
    }
    
    // Check if category exists and get its ID
    let categoryId = data.category;
    
    if (typeof data.category === 'string' && !data.category.match(/^[0-9a-fA-F]{24}$/)) {
      // If category is a slug and not already an ObjectId
      const category = await Category.findOne({ slug: data.category });
      if (!category) {
        return NextResponse.json(
          { success: false, error: 'Category not found' },
          { status: 404 }
        );
      }
      categoryId = category._id;
    }
    
    // Create new product with category ID and ensure slug is included
    const productData = {
      ...data,
      category: categoryId,
      slug: data.slug.trim().toLowerCase()
    };
    
    console.log('Product data being saved to database:', productData);
    
    // Force Mongoose to handle the product creation with a promise
    const product = await new Promise((resolve, reject) => {
      Product.create(productData)
        .then(newProduct => resolve(newProduct))
        .catch(err => reject(err));
    });
    
    // Verify the product was created with the slug
    console.log('Product created successfully. Slug:', (product as any).slug);
    
    // Populate the category information for the response
    await (product as any).populate('category');
    
    return NextResponse.json({ 
      success: true, 
      product 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    
    // Handle duplicate key error
    if (error.code === 11000 && error.keyPattern?.slug) {
      return NextResponse.json(
        { success: false, error: 'A product with this slug already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}