"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Product form interface
interface ProductForm {
  name: string;
  slug: string;
  description: string;
  price: number;
  discountedPrice: number;
  stock: number;
  category: string;
  images: File[];
  specifications: { [key: string]: string };
  features: string[];
  colors: string[];
  bestSeller: boolean;
}

// Category interface
interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function AddProductPage() {
  // Initial state
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
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([
    { key: "", value: "" },
  ]);
  const [features, setFeatures] = useState<string[]>([""]);
  const [colorInput, setColorInput] = useState<string>("");

  // Auth credentials for API calls
  const getAuthHeader = () => {
    const credentials = "admin:admin123"; // Replace with actual credentials or fetch from app state
    const base64Credentials = btoa(credentials);
    return {
      Authorization: `Basic ${base64Credentials}`,
    };
  };

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/admin/api/categories", {
          headers: getAuthHeader(),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        if (data.success) {
          setCategories(data.categories);
        } else {
          console.error("Error fetching categories:", data.error);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Handle text input changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
  const handleNumberInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const value = parseFloat(e.target.value);
    setFormData({ ...formData, [field]: isNaN(value) ? 0 : value });
  };

  // Handle image upload
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormData({ ...formData, images: [...formData.images, ...filesArray] });

      // Generate preview URLs
      filesArray.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreviewUrls((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({ ...formData, images: updatedImages });

    const updatedPreviews = [...imagePreviewUrls];
    updatedPreviews.splice(index, 1);
    setImagePreviewUrls(updatedPreviews);
  };

  // Handle specifications
  const addSpecField = () => {
    setSpecs([...specs, { key: "", value: "" }]);
  };

  const removeSpecField = (index: number) => {
    const updatedSpecs = [...specs];
    updatedSpecs.splice(index, 1);
    setSpecs(updatedSpecs);
  };

  const handleSpecChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updatedSpecs = [...specs];
    updatedSpecs[index][field] = value;
    setSpecs(updatedSpecs);

    // Convert specs array to object and update form data
    const specsObject: { [key: string]: string } = {};
    updatedSpecs.forEach((spec) => {
      if (spec.key.trim() !== "") {
        specsObject[spec.key] = spec.value;
      }
    });
    setFormData({ ...formData, specifications: specsObject });
  };

  // Handle features
  const addFeatureField = () => {
    setFeatures([...features, ""]);
  };

  const removeFeatureField = (index: number) => {
    const updatedFeatures = [...features];
    updatedFeatures.splice(index, 1);
    setFeatures(updatedFeatures);
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = value;
    setFeatures(updatedFeatures);

    // Filter out empty features and update form data
    const filteredFeatures = updatedFeatures.filter(
      (feature) => feature.trim() !== ""
    );
    setFormData({ ...formData, features: filteredFeatures });
  };

  // Handle colors
  const addColor = () => {
    if (colorInput.trim() !== "") {
      setFormData({
        ...formData,
        colors: [...formData.colors, colorInput.trim()],
      });
      setColorInput("");
    }
  };

  const removeColor = (index: number) => {
    const updatedColors = [...formData.colors];
    updatedColors.splice(index, 1);
    setFormData({ ...formData, colors: updatedColors });
  };

  // Toggle best seller
  const toggleBestSeller = () => {
    setFormData({ ...formData, bestSeller: !formData.bestSeller });
  };

  // Helper function to upload images
  const uploadImages = async (images: File[]): Promise<string[]> => {
    try {
      const uploadedUrls = [];

      // Upload each image sequentially
      for (const image of images) {
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
        uploadedUrls.push(data.imageUrl);
      }

      return uploadedUrls;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw new Error("Failed to upload images. Please try again.");
    }
  };

  // Form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Validate form
      if (
        !formData.name ||
        !formData.price ||
        !formData.category ||
        !formData.slug
      ) {
        throw new Error("Please fill in all required fields including slug");
      }

      // Upload images first (if any)
      let imageUrls: string[] = [];
      if (formData.images.length > 0) {
        imageUrls = await uploadImages(formData.images);
      }

      // Prepare the data to send to the API
      const productData = {
        name: formData.name,
        slug: formData.slug,
        price: formData.price,
        discountedPrice: formData.discountedPrice,
        stock: formData.stock,
        image: imageUrls.length > 0 ? imageUrls[0] : "", // First image is the main image
        images: imageUrls, // All images
        description: formData.description,
        category: formData.category,
        colors: formData.colors.length > 0 ? formData.colors : [], // Ensure colors array is sent
        bestSeller: formData.bestSeller,
        features: formData.features.filter((feature) => feature.trim() !== ""),
        specifications: formData.specifications,
        inStock: formData.stock > 0, // Set inStock based on stock quantity
      };

      console.log("Submitting product data:", productData); // Debug log

      // Send the data to the admin API
      const response = await fetch("/admin/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add product");
      }

      // Show success message
      setMessage({
        text: "Product added successfully!",
        type: "success",
      });

      // Reset form
      setFormData({
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
      });
      setSpecs([{ key: "", value: "" }]);
      setFeatures([""]);
      setImagePreviewUrls([]);
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage({
        text:
          error instanceof Error
            ? error.message
            : "Failed to add product. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Add New Product</h1>
        <Link
          href="/admin/products"
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
          Back to Products
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
            {/* Product Name */}
            <div>
              <Label htmlFor="name">Product Name*</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter product name"
                className="mt-1"
              />
            </div>

            {/* Product Slug */}
            <div>
              <Label htmlFor="slug">Slug (URL)*</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                placeholder="product-url-slug"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Auto-generated from product name. You can edit if needed.
              </p>
            </div>
          </div>

          {/* Product Description */}
          <div>
            <Label htmlFor="description">Description*</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Enter detailed product description"
              className="mt-1 h-32"
            />
          </div>

          {/* Prices and Stock */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="price">Price (₹)*</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price || ""}
                onChange={(e) => handleNumberInputChange(e, "price")}
                required
                placeholder="0.00"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="discountedPrice">
                Discounted Price (₹){" "}
                <span className="text-gray-500">(Optional)</span>
              </Label>
              <Input
                id="discountedPrice"
                name="discountedPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.discountedPrice || ""}
                onChange={(e) => handleNumberInputChange(e, "discountedPrice")}
                placeholder="0.00"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="stock">Stock Quantity*</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock || ""}
                onChange={(e) => handleNumberInputChange(e, "stock")}
                required
                placeholder="0"
                className="mt-1"
              />
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <Label htmlFor="category">Category*</Label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="mt-1 w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Best Seller Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="bestSeller"
              checked={formData.bestSeller}
              onChange={toggleBestSeller}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="bestSeller">Mark as Best Seller</Label>
          </div>

          {/* Product Colors */}
          <div>
            <Label>Product Colors</Label>
            <div className="flex mt-1 space-x-2">
              <Input
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                placeholder="Add a color (e.g. Red, Blue, etc.)"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={addColor}
                variant="outline"
                className="whitespace-nowrap"
              >
                Add Color
              </Button>
            </div>

            {formData.colors.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.colors.map((color, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-100 px-3 py-1 rounded-full"
                  >
                    <span>{color}</span>
                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
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
                ))}
              </div>
            )}
          </div>

          {/* Product Features */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Product Features</Label>
              <button
                type="button"
                onClick={addFeatureField}
                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Feature
              </button>
            </div>

            <div className="space-y-3 mt-1">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Input
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder="Enter a product feature"
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeatureField(index)}
                    className="p-2 rounded-md hover:bg-red-100 text-red-600"
                    disabled={features.length <= 1}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Product Images */}
          <div>
            <Label>Product Images*</Label>
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
                    Drag and drop image files here, or click to select files
                  </p>
                </div>
                <div className="mt-3">
                  <Input
                    id="images"
                    name="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="sr-only"
                  />
                  <label
                    htmlFor="images"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                  >
                    Select Images
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>

              {imagePreviewUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imagePreviewUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative rounded-lg overflow-hidden border border-gray-200"
                    >
                      <Image
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-red-600"
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
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Specifications */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Product Specifications</Label>
              <button
                type="button"
                onClick={addSpecField}
                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Specification
              </button>
            </div>

            <div className="space-y-3 mt-1">
              {specs.map((spec, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Input
                    value={spec.key}
                    onChange={(e) =>
                      handleSpecChange(index, "key", e.target.value)
                    }
                    placeholder="Feature name"
                    className="flex-1"
                  />
                  <Input
                    value={spec.value}
                    onChange={(e) =>
                      handleSpecChange(index, "value", e.target.value)
                    }
                    placeholder="Feature value"
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpecField(index)}
                    className="p-2 rounded-md hover:bg-red-100 text-red-600"
                    disabled={specs.length <= 1}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))}
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
                  Save Product
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
