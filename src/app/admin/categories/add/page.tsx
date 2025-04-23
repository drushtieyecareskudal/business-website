"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Category form interface
interface CategoryForm {
  name: string;
  slug: string;
  description: string;
  image: File | null;
  order: number;
  active: boolean;
}

export default function AddCategoryPage() {
  // Initial state
  const [formData, setFormData] = useState<CategoryForm>({
    name: "",
    slug: "",
    description: "",
    image: null,
    order: 0,
    active: true,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Auth credentials for API calls
  const getAuthHeader = () => {
    const credentials = "admin:admin123"; // Replace with actual credentials or fetch from app state
    const base64Credentials = btoa(credentials);
    return {
      Authorization: `Basic ${base64Credentials}`,
    };
  };

  // Handle text input changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Auto-generate slug from name
    if (name === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  // Handle number input changes
  const handleNumberInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setFormData({ ...formData, order: isNaN(value) ? 0 : value });
  };

  // Handle image upload
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });

      // Generate preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image
  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreviewUrl(null);
  };

  // Toggle active status
  const toggleActive = () => {
    setFormData({ ...formData, active: !formData.active });
  };

  // Helper function to upload image
  const uploadImage = async (image: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", image);

      const response = await fetch("/admin/api/upload", {
        method: "POST",
        headers: getAuthHeader(),
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload image");
      }

      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image. Please try again.");
    }
  };

  // Form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Validate form
      if (!formData.name || !formData.slug) {
        throw new Error("Please fill in all required fields");
      }

      // Upload image first (if any)
      let imageUrl = "";
      if (formData.image) {
        imageUrl = await uploadImage(formData.image);
      }

      // Prepare the data to send to the API
      const categoryData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        image: imageUrl,
        order: formData.order,
        active: formData.active,
      };

      // Send the data to the admin API
      const response = await fetch("/admin/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(categoryData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add category");
      }

      // Show success message
      setMessage({
        text: "Category added successfully!",
        type: "success",
      });

      // Reset form
      setFormData({
        name: "",
        slug: "",
        description: "",
        image: null,
        order: 0,
        active: true,
      });
      setImagePreviewUrl(null);
    } catch (error) {
      console.error("Error adding category:", error);
      setMessage({
        text:
          error instanceof Error
            ? error.message
            : "Failed to add category. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Add New Category</h1>
        <Link
          href="/admin/categories"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Categories
        </Link>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <Card className="p-6 bg-white border rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Name */}
            <div>
              <Label htmlFor="name">Category Name*</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter category name"
                className="mt-1"
              />
            </div>

            {/* Category Slug */}
            <div>
              <Label htmlFor="slug">Slug (URL)*</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                placeholder="category-url-slug"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Auto-generated from category name. You can edit if needed.
              </p>
            </div>
          </div>

          {/* Category Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter category description"
              className="mt-1 h-32"
            />
          </div>

          {/* Order */}
          <div>
            <Label htmlFor="order">Display Order</Label>
            <Input
              id="order"
              name="order"
              type="number"
              min="0"
              value={formData.order || ""}
              onChange={handleNumberInputChange}
              placeholder="0"
              className="mt-1 w-full max-w-xs"
            />
            <p className="text-xs text-gray-500 mt-1">
              Lower numbers will appear first. Default is 0.
            </p>
          </div>

          {/* Active Status Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={toggleActive}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="active">Active Category</Label>
          </div>

          {/* Category Image */}
          <div>
            <Label>Category Image</Label>
            <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Drag and drop image file here, or click to select file
                  </p>
                </div>
                <div className="mt-3">
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="sr-only"
                  />
                  <label
                    htmlFor="image"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                  >
                    Select Image
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>

              {imagePreviewUrl && (
                <div className="mt-4 flex justify-center">
                  <div className="relative rounded-lg overflow-hidden border border-gray-200 w-48 h-48">
                    <img
                      src={imagePreviewUrl}
                      alt={`Category preview`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Save Category
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
