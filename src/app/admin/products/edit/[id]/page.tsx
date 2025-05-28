"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

// Types
interface ProductForm {
  name: string;
  slug: string;
  description: string;
  price: number;
  discountedPrice: number;
  stock: number;
  category: string;
  images: string[];
  specifications: { [key: string]: string };
  features: string[];
  colors: string[];
  bestSeller: boolean;
  inStock: boolean;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    slug: "",
    description: "",
    price: 0,
    discountedPrice: 0,
    stock: 0,
    category: "",
    images: [],
    specifications: {},
    features: [],
    colors: [],
    bestSeller: false,
    inStock: true,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  const [newFeature, setNewFeature] = useState("");
  const [newColor, setNewColor] = useState("");

  // Fetch product data and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch product details
        const productResponse = await fetch(`/api/products/${id}`);

        if (!productResponse.ok) {
          throw new Error("Failed to fetch product details");
        }

        const productData = await productResponse.json();

        // Fetch categories
        const categoriesResponse = await fetch("/api/categories");

        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories");
        }

        const categoriesData = await categoriesResponse.json();

        // Set state with fetched data
        setCategories(categoriesData.categories || []);

        // Map product data to form state
        if (productData.product) {
          const product = productData.product;
          setFormData({
            name: product.name || "",
            slug: product.slug || "",
            description: product.description || "",
            price: product.price || 0,
            discountedPrice: product.discountedPrice || 0,
            stock: product.stock || 0,
            category: product.category ? product.category._id : "",
            images: product.images || [],
            specifications: product.specifications || {},
            features: product.features || [],
            colors: product.colors || [],
            bestSeller: product.bestSeller || false,
            inStock: product.inStock ?? true,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load product data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    // Handle checkbox
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

    // Handle numeric values
    if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
      return;
    }

    // Handle other inputs
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      // Prepare product data for API
      const productData = {
        ...formData,
      };

      // Send the data to the admin API
      const response = await fetch(`/admin/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update product");
      }

      // Show success message
      setMessage({
        text: "Product updated successfully!",
        type: "success",
      });

      // Navigate back to products page after 2 seconds
      setTimeout(() => {
        router.push("/admin/products");
      }, 2000);
    } catch (error) {
      console.error("Error updating product:", error);
      setMessage({
        text:
          error instanceof Error ? error.message : "Failed to update product",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  // Add a new specification
  const addSpecification = () => {
    if (newSpecKey.trim() === "" || newSpecValue.trim() === "") return;

    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [newSpecKey]: newSpecValue,
      },
    }));

    setNewSpecKey("");
    setNewSpecValue("");
  };

  // Remove a specification
  const removeSpecification = (key: string) => {
    const updatedSpecifications = { ...formData.specifications };
    delete updatedSpecifications[key];
    setFormData((prev) => ({
      ...prev,
      specifications: updatedSpecifications,
    }));
  };

  // Add a new feature
  const addFeature = () => {
    if (newFeature.trim() === "") return;

    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, newFeature],
    }));

    setNewFeature("");
  };

  // Remove a feature
  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  // Add a new color
  const addColor = () => {
    if (newColor.trim() === "") return;

    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, newColor],
    }));

    setNewColor("");
  };

  // Remove a color
  const removeColor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));
  };

  // Generate slug from name
  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setFormData((prev) => ({
      ...prev,
      slug,
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-2">Loading product data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p className="text-red-500">{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/admin/products")}
        >
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <Link href="/admin/products">
          <Button variant="outline">Back to Products</Button>
        </Link>
      </div>

      {/* Status message */}
      {message && (
        <div
          className={`p-4 mb-6 rounded-md ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-medium mb-4">Basic Information</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Product Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="ml-2 h-6"
                  onClick={generateSlug}
                >
                  Generate
                </Button>
              </Label>
              <Input
                id="slug"
                name="slug"
                type="text"
                value={formData.slug}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Discounted Price */}
            <div className="space-y-2">
              <Label htmlFor="discountedPrice">Discounted Price (₹)</Label>
              <Input
                id="discountedPrice"
                name="discountedPrice"
                type="number"
                min="0"
                value={formData.discountedPrice}
                onChange={handleInputChange}
              />
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleInputChange}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full h-9 rounded-md border border-input px-3 py-1 text-sm shadow-sm transition-colors"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Best Seller */}
            <div className="flex items-center space-x-2">
              <input
                id="bestSeller"
                name="bestSeller"
                type="checkbox"
                checked={formData.bestSeller}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="bestSeller">Mark as Best Seller</Label>
            </div>

            {/* In Stock */}
            <div className="flex items-center space-x-2">
              <input
                id="inStock"
                name="inStock"
                type="checkbox"
                checked={formData.inStock}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="inStock">In Stock</Label>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={5}
            />
          </div>
        </div>

        {/* Images */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-medium mb-4">Product Images</h2>

          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Current images. To update images, please add new ones through the
              product editing screen.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={image}
                    alt={`Product image ${index + 1}`}
                    className="h-32 w-full object-cover rounded-md border"
                  />
                </div>
              ))}

              {formData.images.length === 0 && (
                <div className="h-32 flex items-center justify-center bg-gray-100 rounded-md border">
                  <p className="text-gray-500 text-sm">No images</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-medium mb-4">Specifications</h2>

          <div className="space-y-4">
            {/* Add new specification */}
            <div className="flex space-x-2">
              <Input
                placeholder="Specification name"
                value={newSpecKey}
                onChange={(e) => setNewSpecKey(e.target.value)}
              />
              <Input
                placeholder="Specification value"
                value={newSpecValue}
                onChange={(e) => setNewSpecValue(e.target.value)}
              />
              <Button type="button" onClick={addSpecification}>
                Add
              </Button>
            </div>

            {/* List of specifications */}
            {Object.keys(formData.specifications).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(formData.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                  >
                    <div>
                      <span className="font-medium">{key}:</span> {value}
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeSpecification(key)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No specifications added yet.</p>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-medium mb-4">Features</h2>

          <div className="space-y-4">
            {/* Add new feature */}
            <div className="flex space-x-2">
              <Input
                placeholder="Add a product feature"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
              />
              <Button type="button" onClick={addFeature}>
                Add
              </Button>
            </div>

            {/* List of features */}
            {formData.features.length > 0 ? (
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                  >
                    <div>{feature}</div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFeature(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No features added yet.</p>
            )}
          </div>
        </div>

        {/* Colors */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-medium mb-4">Colors</h2>

          <div className="space-y-4">
            {/* Add new color */}
            <div className="flex space-x-2">
              <Input
                placeholder="Add a product color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
              />
              <Button type="button" onClick={addColor}>
                Add
              </Button>
            </div>

            {/* List of colors */}
            {formData.colors.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.colors.map((color, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full"
                  >
                    {color}
                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      className="text-blue-700 hover:text-blue-900"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No colors added yet.</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Link href="/admin/products">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <span className="inline-block h-4 w-4 mr-2 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                Saving...
              </>
            ) : (
              "Update Product"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
