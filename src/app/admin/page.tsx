"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

// Dashboard stats types
type DashboardStats = {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  recentProducts: {
    _id: string;
    name: string;
    price: number;
    category: string;
  }[];
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    recentProducts: [],
  });
  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats when the component mounts
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real application, you would fetch this data from your API
        // For now, we'll use placeholder data
        const data: DashboardStats = {
          totalProducts: 0,
          totalCategories: 0,
          totalOrders: 0,
          recentProducts: [],
        };

        setStats(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div>
          <Link href="/admin/products/add">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New Product
            </button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-white border rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0v10l-8 4m0-10L4 7m8 4v10"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Total Products
                  </p>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {stats.totalProducts}
                  </h3>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  href="/admin/products"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View all products →
                </Link>
              </div>
            </Card>

            <Card className="p-6 bg-white border rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Total Categories
                  </p>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {stats.totalCategories}
                  </h3>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  href="/admin/categories"
                  className="text-sm text-green-600 hover:text-green-800"
                >
                  View all categories →
                </Link>
              </div>
            </Card>

            <Card className="p-6 bg-white border rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Total Orders
                  </p>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {stats.totalOrders}
                  </h3>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  href="/admin/orders"
                  className="text-sm text-purple-600 hover:text-purple-800"
                >
                  View all orders →
                </Link>
              </div>
            </Card>
          </div>

          {/* Recent Products */}
          <div className="bg-white border rounded-lg shadow-sm mb-8">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Products
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Product
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recentProducts.map((product) => (
                    <tr key={product._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {product.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 text-xs font-medium rounded-full capitalize bg-blue-100 text-blue-800">
                          {product.category.replace("-", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">₹{product.price}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link
                          href={`/admin/products/edit/${product._id}`}
                          className="text-blue-600 hover:text-blue-800 mr-4"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/category/${product.category}/view/${product._id}`}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
