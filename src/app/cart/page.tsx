"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    discountedPrice?: number;
    images: string[];
    inStock: boolean;
  };
  quantity: number;
}

interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);

  // Fetch cart data when component mounts or user changes
  useEffect(() => {
    const fetchCart = async () => {
      if (!authLoading) {
        if (!user) {
          // Redirect to login if not authenticated
          router.push("/login?redirect=/cart");
          return;
        }

        setLoading(true);
        try {
          const response = await fetch("/api/cart");
          const data = await response.json();

          if (response.ok) {
            setCart(data.cart);
          } else {
            toast.error(data.error || "Failed to fetch cart");
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
          toast.error("Something went wrong. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCart();
  }, [authLoading, user, router]);

  // Handle quantity change
  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdatingItem(productId);

    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: newQuantity,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCart(data.cart);
        toast.success("Cart updated successfully");
      } else {
        toast.error(data.error || "Failed to update cart");
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setUpdatingItem(null);
    }
  };

  // Handle remove item
  const removeItem = async (productId: string) => {
    setUpdatingItem(productId);

    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: 0, // Setting quantity to 0 will remove the item
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCart(data.cart);
        toast.success("Item removed from cart");
      } else {
        toast.error(data.error || "Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setUpdatingItem(null);
    }
  };

  // Handle clear cart
  const clearCart = async () => {
    if (!confirm("Are you sure you want to clear your cart?")) return;

    setLoading(true);

    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setCart(null);
        toast.success("Cart cleared successfully");
      } else {
        toast.error(data.error || "Failed to clear cart");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    if (!cart || !cart.items || cart.items.length === 0) return 0;

    return cart.items.reduce((total, item) => {
      const price = item.product.discountedPrice || item.product.price;
      return total + price * item.quantity;
    }, 0);
  };

  if (authLoading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <div className="inline-block animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent h-8 w-8"></div>
        <p className="mt-2">Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    return null; // We're redirecting in the useEffect, so just return null here
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <div className="inline-block animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent h-8 w-8"></div>
        <p className="mt-2">Loading your cart...</p>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">
            Looks like you haven&apos;t added any products to your cart yet
          </p>
          <Link href="/category">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold">
                  Cart Items (
                  {cart.items.reduce((total, item) => total + item.quantity, 0)}
                  )
                </h2>
                <Button
                  variant="ghost"
                  onClick={clearCart}
                  disabled={loading}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  Clear Cart
                </Button>
              </div>
            </div>

            <div className="divide-y">
              {cart.items.map((item) => (
                <div
                  key={item.product._id}
                  className="p-4 flex flex-col sm:flex-row items-start sm:items-center"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border mb-3 sm:mb-0 relative">
                    <Image
                      src={item.product.images[0] || "/placeholder.jpg"}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="sm:ml-4 flex-grow">
                    <Link href={`/product/${item.product.slug}`}>
                      <h3 className="font-medium text-blue-600 hover:underline">
                        {item.product.name}
                      </h3>
                    </Link>

                    <div className="mt-1 text-sm text-gray-500">
                      Price: ₹
                      {(
                        item.product.discountedPrice || item.product.price
                      ).toLocaleString()}
                      {item.product.discountedPrice && (
                        <span className="ml-2 line-through text-gray-400">
                          ₹{item.product.price.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Quantity Selector */}
                    <div className="mt-3 flex items-center">
                      <button
                        className="p-1 rounded border w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                        onClick={() =>
                          updateQuantity(item.product._id, item.quantity - 1)
                        }
                        disabled={!!updatingItem || item.quantity <= 1}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      <span className="mx-3 w-8 text-center">
                        {updatingItem === item.product._id ? (
                          <div className="h-5 w-5 mx-auto animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent"></div>
                        ) : (
                          item.quantity
                        )}
                      </span>

                      <button
                        className="p-1 rounded border w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                        onClick={() =>
                          updateQuantity(item.product._id, item.quantity + 1)
                        }
                        disabled={!!updatingItem}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      {/* Remove Item Button */}
                      <button
                        className="ml-4 p-1 text-red-500 hover:text-red-600"
                        onClick={() => removeItem(item.product._id)}
                        disabled={!!updatingItem}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="mt-3 sm:mt-0 ml-auto text-right">
                    <p className="font-semibold">
                      ₹
                      {(
                        (item.product.discountedPrice || item.product.price) *
                        item.quantity
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between pb-3 border-b">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  ₹{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between pb-3 border-b">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between pb-3 text-lg font-bold">
                <span>Total</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>{" "}
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 py-6"
                onClick={() => router.push("/checkout")}
              >
                Proceed to Checkout
              </Button>
              <p className="text-center text-sm text-gray-500 mt-4">
                or{" "}
                <Link
                  href="/category"
                  className="text-blue-600 hover:underline"
                >
                  Continue Shopping
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
