"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Type definitions
interface Product {
  _id: string;
  slug: string;
  name: string;
  price: number;
  images: string[];
  rating: number;
  colors: string[];
  bestSeller: boolean;
}

interface CategoryInfo {
  name: string;
  description?: string;
}

type CategoryParams = { params: Promise<{ slug: string }> };

export default function CategorySlug({ params }: CategoryParams) {
  // Get the slug directly from params
  const { slug } = React.use(params);

  const [products, setProducts] = useState<Product[]>([]);
  const [categoryInfo, setCategoryInfo] = useState<CategoryInfo>({ name: "" });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("featured");

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/categories/${slug}`);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data.products);
        setCategoryInfo(data.category);
      } catch (err) {
        setError("Error loading products. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug, sortBy]);

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  if (loading) {
    return (
      <div className="py-8 text-center">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-500">{error}</p>
        <Link href="/category">
          <Button variant="outline" className="mt-4">
            Browse All Categories
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{categoryInfo.name}</h1>
        <div className="flex items-center">
          <label htmlFor="sort" className="mr-2 text-sm text-gray-600">
            Sort by:
          </label>
          <select
            id="sort"
            className="p-2 border rounded-md text-sm"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {categoryInfo.description && (
        <p className="text-gray-600 mb-4">{categoryInfo.description}</p>
      )}

      <p className="text-gray-600 mb-8">
        {products.length} items in {categoryInfo.name}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            href={`/product/${product._id}`}
            key={product._id}
            className="no-underline"
          >
            <Card className="h-full overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                {/* {JSON.stringify(product, null, 2)} */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {product.bestSeller && (
                    <Badge className="absolute top-2 right-2 bg-yellow-500">
                      Best Seller
                    </Badge>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                  <p className="text-blue-600 font-bold mb-2">
                    ₹{product.price.toLocaleString()}
                  </p>

                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400 mr-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill={
                            i < Math.floor(product.rating)
                              ? "currentColor"
                              : "none"
                          }
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm">
                      {product.rating}
                    </span>
                  </div>

                  {product.colors && product.colors.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {product.colors.map((color, i) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-100 px-2 py-1 rounded"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">
            We couldn't find any products in this category.
          </p>
          <Link href="/category">
            <Button variant="outline">Browse All Categories</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
