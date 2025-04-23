"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Type definitions
interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountedPrice?: number;
  images: string[];
  specifications?: Record<string, string>;
  features?: string[];
  colors?: string[];
  rating?: number;
  bestSeller?: boolean;
  inStock?: boolean;
  category?: {
    _id: string;
    name: string;
    slug: string;
  };
}

export default function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [addingToCart, setAddingToCart] = useState<boolean>(false);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Fetch the product by slug
        const response = await fetch(`/api/products/${slug}`);

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();
        setProduct(data.product);

        // Set the first image as selected by default
        if (data.product?.images && data.product.images.length > 0) {
          setSelectedImage(data.product.images[0]);
        }
      } catch (err) {
        setError("Error loading product. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // Handle quantity change
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!product) return;

    // Check if user is logged in
    if (!user) {
      toast.error("Please login to add items to your cart");
      router.push("/login");
      return;
    }

    if (!product.inStock) {
      toast.error("This product is out of stock");
      return;
    }

    setAddingToCart(true);

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: quantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add to cart");
      }

      toast.success("Product added to cart successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to add to cart");
      console.error("Add to cart error:", err);
    } finally {
      setAddingToCart(false);
    }
  };

  // Calculate savings if there's a discounted price
  const calculateSavings = () => {
    if (product?.price && product?.discountedPrice) {
      const savings = product.price - product.discountedPrice;
      const savingsPercentage = (savings / product.price) * 100;
      return {
        amount: savings,
        percentage: Math.round(savingsPercentage),
      };
    }
    return null;
  };

  const savings = calculateSavings();

  if (loading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-2">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p className="text-red-500 text-xl mb-4">
          {error || "Product not found"}
        </p>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Breadcrumb Navigation */}
      <div className="text-sm breadcrumbs mb-6">
        <ul className="flex gap-2 text-gray-500">
          <li>
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
          </li>
          <span>/</span>
          {product.category && (
            <>
              <li>
                <Link
                  href={`/category/${product.category.slug}`}
                  className="hover:text-blue-600"
                >
                  {product.category.name}
                </Link>
              </li>
              <span>/</span>
            </>
          )}
          <li className="text-gray-700 font-medium truncate">{product.name}</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Images Section */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border bg-white">
            <img
              src={selectedImage || product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-auto py-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`aspect-square w-20 flex-shrink-0 overflow-hidden rounded-md border ${
                    selectedImage === image
                      ? "ring-2 ring-blue-600"
                      : "hover:ring-1 hover:ring-gray-300"
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image}
                    alt={`${product.name} - View ${index + 1}`}
                    className="h-full w-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>

            {/* Product Badges */}
            <div className="mt-2 flex flex-wrap gap-2">
              {product.bestSeller && (
                <Badge className="bg-yellow-500">Best Seller</Badge>
              )}
              {product.inStock ? (
                <Badge className="bg-green-500">In Stock</Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-red-500 border-red-500"
                >
                  Out of Stock
                </Badge>
              )}

              {product.rating && (
                <div className="flex items-center gap-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill={
                          i < Math.floor(product.rating || 0)
                            ? "currentColor"
                            : "none"
                        }
                        stroke="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Product Price */}
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              {product.discountedPrice ? (
                <>
                  <span className="text-3xl font-bold text-blue-600">
                    ₹{product.discountedPrice.toLocaleString()}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {savings && (
                    <span className="text-sm font-medium text-green-600">
                      Save {savings.percentage}% (₹
                      {savings.amount.toLocaleString()})
                    </span>
                  )}
                </>
              ) : (
                <span className="text-3xl font-bold text-blue-600">
                  ₹{product.price.toLocaleString()}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Price inclusive of all taxes
            </p>
          </div>

          {/* Colors Section (if available) */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700">Colors</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colors.map((color, i) => (
                  <div
                    key={i}
                    className="rounded-md border border-gray-200 px-3 py-1 text-sm"
                  >
                    {color}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700">Quantity</h3>
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={decreaseQuantity}
                className="rounded-md border p-2 hover:bg-gray-100"
                disabled={quantity <= 1}
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
              <span className="w-10 text-center">{quantity}</span>
              <button
                onClick={increaseQuantity}
                className="rounded-md border p-2 hover:bg-gray-100"
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
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button
              className="flex-1 gap-2 py-6"
              disabled={!product.inStock || addingToCart}
              onClick={handleAddToCart}
            >
              {addingToCart ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                  Adding...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  Add to Cart
                </>
              )}
            </Button>
            <Button variant="outline" className="flex-1 gap-2 py-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              Add to Wishlist
            </Button>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="pt-4">
            <Card>
              <CardContent className="prose max-w-none py-4">
                <p>{product.description}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="pt-4">
            <Card>
              <CardContent className="py-4">
                {product.specifications &&
                Object.keys(product.specifications).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <div key={key} className="border-b pb-2">
                          <h4 className="text-sm font-semibold text-gray-600">
                            {key}
                          </h4>
                          <p>{value}</p>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">No specifications available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="pt-4">
            <Card>
              <CardContent className="py-4">
                {product.features && product.features.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No features listed</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
