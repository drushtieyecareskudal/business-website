"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// TypeScript interface for Category
interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
  active: boolean;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        // Using admin-specific API route
        const response = await fetch("/api/categories", {
          headers: {
            Authorization: `Basic ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        if (data.success) {
          setCategories(data.categories);
        } else {
          setError(data.error || "Failed to fetch categories");
        }
      } catch (err) {
        setError(
          `An error occurred while fetching categories: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const handleDeleteCategory = async (id: string, slug: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        // Using slug instead of id to match the API route structure
        const response = await fetch(`/admin/api/categories/${slug}`, {
          method: "DELETE",
        });
        const data = await response.json();

        if (data.success) {
          // Remove the deleted category from the state
          setCategories(categories.filter((category) => category._id !== id));
        } else {
          alert(data.error || "Failed to delete category");
        }
      } catch (err) {
        alert(
          `An error occurred while deleting the category: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
        console.error("Delete error:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Categories</h1>
        <p>Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Categories</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Link href="/admin/categories/add">
          <Button>Add New Category</Button>
        </Link>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>All Categories ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p>No categories found. Create your first category!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card key={category._id} className="overflow-hidden">
                  <div className="relative h-40 w-full">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-500">No Image</p>
                      </div>
                    )}
                    {!category.active && (
                      <Badge
                        variant="destructive"
                        className="absolute top-2 right-2"
                      >
                        Inactive
                      </Badge>
                    )}
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="text-xl font-semibold mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      Slug: {category.slug}
                    </p>
                    <p className="text-sm mb-4 line-clamp-2">
                      {category.description || "No description"}
                    </p>
                    <Separator className="my-3" />
                    <div className="flex justify-between items-center mt-2">
                      <Link href={`/admin/categories/${category.slug}/edit`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          handleDeleteCategory(category._id, category.slug)
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
