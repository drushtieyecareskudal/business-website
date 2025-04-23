import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbconnect';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// Helper function to get user ID from token
const getUserId = async (request: NextRequest) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return null;
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string };
    return decoded.id;
  } catch (error) {
    return null;
  }
};

// Get cart items for current user
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const userId = await getUserId(request);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Find cart for user
    const cart = await Cart.findOne({ user: userId }).populate({
      path: 'items.product',
      select: 'name slug price images discountedPrice inStock'
    });
    
    if (!cart) {
      return NextResponse.json({
        success: true,
        cart: { items: [] }
      });
    }
    
    return NextResponse.json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add item to cart
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const userId = await getUserId(request);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { productId, quantity = 1 } = await request.json();
    
    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    // Check if product exists and is in stock
    const product = await Product.findById(productId);
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    if (!product.inStock) {
      return NextResponse.json(
        { success: false, error: 'Product is out of stock' },
        { status: 400 }
      );
    }
    
    // Find or create cart for user
    let cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: []
      });
    }
    
    // Check if product already in cart
    const itemIndex = cart.items.findIndex(
      (item: { product: any, quantity: number }) => item.product.toString() === productId
    );
    
    if (itemIndex > -1) {
      // Update quantity if product exists in cart
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({
        product: productId,
        quantity
      });
    }
    
    await cart.save();
    
    // Get updated cart with populated product info
    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug price images discountedPrice inStock'
    });
    
    return NextResponse.json({
      success: true,
      cart: updatedCart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update cart (change quantity or remove items)
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    
    const userId = await getUserId(request);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { productId, quantity } = await request.json();
    
    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    // Find cart for user
    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' },
        { status: 404 }
      );
    }
    
    const itemIndex = cart.items.findIndex(
      (item: any) => item.product.toString() === productId
    );
    
    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Item not found in cart' },
        { status: 404 }
      );
    }
    
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }
    
    await cart.save();
    
    // Get updated cart with populated product info
    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug price images discountedPrice inStock'
    });
    
    return NextResponse.json({
      success: true,
      cart: updatedCart
    });
  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete entire cart
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    
    const userId = await getUserId(request);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Delete cart
    await Cart.findOneAndDelete({ user: userId });
    
    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Delete cart error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}