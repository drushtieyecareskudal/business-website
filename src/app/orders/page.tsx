"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface OrderItem {
  product: {
    _id: string;
    name: string;
    slug: string;
    images: string[];
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!authLoading) {
        if (!user) {
          // Redirect to login if not authenticated
          router.push("/login?redirect=/orders");
          return;
        }

        setLoading(true);
        try {
          const response = await fetch("/api/orders");
          if (!response.ok) {
            throw new Error("Failed to fetch orders");
          }
          const ordersData = await response.json();
          if (ordersData.success) {
            setOrders(ordersData.orders);
          } else {
            throw new Error(ordersData.message || "Failed to fetch orders");
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
          toast.error("Error loading your orders");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [user, authLoading, router]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="container py-8 px-4">
        <div className="flex flex-col items-center justify-center h-60">
          <div className="mb-4">Loading your orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div className="my-8">
            <h2 className="text-xl font-semibold mb-2">No orders found</h2>
            <p className="text-gray-600 mb-6">
              You haven&apos;t placed any orders yet.
            </p>
            <Link href="/category">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-sm border"
            >
              <div className="p-4 border-b flex flex-col md:flex-row md:items-center justify-between">
                <div className="mb-2 md:mb-0">
                  <div className="text-sm text-gray-500">
                    Order placed {formatDate(order.createdAt)}
                  </div>
                  <div className="flex flex-col md:flex-row md:gap-4 text-sm">
                    <span>
                      <span className="text-gray-500">Order ID:</span>{" "}
                      <span className="font-medium">{order._id}</span>
                    </span>
                    <span>
                      <span className="text-gray-500">Total:</span>{" "}
                      <span className="font-medium">
                        ₹{order.totalAmount.toLocaleString()}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                  <Link href={`/orders/${order._id}`}>
                    <Button size="sm" variant="outline">
                      View Order
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="p-4">
                <div className="text-sm text-gray-500 mb-2">
                  {order.items.length}{" "}
                  {order.items.length === 1 ? "item" : "items"}
                </div>
                <div className="flex flex-wrap gap-2">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="text-sm">
                      {item.product.name}
                      {index < Math.min(3, order.items.length - 1) ? "," : ""}
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="text-sm text-gray-500">
                      and {order.items.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
