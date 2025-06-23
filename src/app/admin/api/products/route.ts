import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbconnect";
import Product from "@/models/Product";

// POST /admin/api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse the request body
    const body = await request.json();
    
    // Basic validation
    if (!body.name || !body.slug || !body.price || !body.category) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields: name, slug, price, or category",
      }, { status: 400 });
    }

    // Check if product with the same slug already exists
    const existingProduct = await Product.findOne({ slug: body.slug });

    if (existingProduct) {
      return NextResponse.json({
        success: false,
        error: "A product with this slug already exists",
      }, { status: 409 });
    }

    // Create a new product
    const product = new Product(body);
    await product.save();

    return NextResponse.json({
      success: true,
      product,
    }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating product:", error);
    
    // Provide more specific error messages
    if (error instanceof Error && error.name === 'ValidationError') {
      const typedError = error as unknown as { errors: Record<string, { message: string }> };
      const validationErrors = Object.values(typedError.errors).map((err) => err.message);
      return NextResponse.json({
        success: false,
        error: "Validation failed: " + validationErrors.join(', '),
        details: typedError.errors,
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: "Failed to create product",
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}

// GET /admin/api/products - Get all products
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") || "desc";

    // Build query
    let query = {};
    if (search) {
      query = { ...query, name: { $regex: search, $options: "i" } };
    }
    if (category) {
      query = { ...query, category };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Fetch products with sorting and pagination
    const products = await Product.find(query)
      .populate("category", "name slug")
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(query);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        total: totalProducts,
        page,
        limit,
        pages: Math.ceil(totalProducts / limit),
      },
    });

  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch products",
    }, { status: 500 });
  }
}
