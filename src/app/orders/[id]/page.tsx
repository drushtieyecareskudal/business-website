"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";

interface OrderItem {
  product: {
    _id: string;
    name: string;
    slug: string;
    images: string[];
    price: number;
    discountedPrice?: number;
  };
  quantity: number;
  price: number;
  _id: string;
}

interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const orderId = React.use(params).id;

  useEffect(() => {
    const fetchOrder = async () => {
      if (!authLoading) {
        if (!user) {
          // Redirect to login if not authenticated
          router.push("/login?redirect=/orders");
          return;
        }

        setLoading(true);
        try {
          const response = await fetch(`/api/orders/${orderId}`);
          if (!response.ok) {
            if (response.status === 404) {
              toast.error("Order not found.");
              router.push("/orders");
              return;
            }
            throw new Error("Failed to fetch order");
          }
          const orderData = await response.json();
          if (orderData.success) {
            setOrder(orderData.order);
          } else {
            throw new Error(orderData.message || "Failed to fetch order");
          }
        } catch (error) {
          console.error("Error fetching order:", error);
          toast.error("Error loading order data");
        } finally {
          setLoading(false);
        }
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [user, authLoading, router, orderId]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
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

  // Get payment status badge color
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="container py-8 px-4">
        <div className="flex flex-col items-center justify-center h-60">
          <div className="mb-4">Loading order details...</div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-8 px-4">
        <div className="flex flex-col items-center justify-center h-60">
          <div className="mb-4">Order not found.</div>
          <Link href="/orders">
            <Button>View All Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success message for recent orders */}
        {new Date(order.createdAt).getTime() > Date.now() - 5 * 60 * 1000 && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-green-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-green-800 mb-2">
              Order Placed Successfully!
            </h2>
            <p className="text-green-700">
              Thank you for your purchase. Your order has been placed and is now
              being processed.
            </p>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Order Details</h1>
          <Link href="/orders">
            <Button variant="outline">View All Orders</Button>
          </Link>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <div className="mb-4">
                <span className="text-gray-500">Order Number:</span>
                <span className="ml-2 font-semibold">{order._id}</span>
              </div>
              <div className="mb-4">
                <span className="text-gray-500">Date Placed:</span>
                <span className="ml-2">{formatDate(order.createdAt)}</span>
              </div>
            </div>
            <div>
              <div className="mb-4">
                <span className="text-gray-500">Status:</span>
                <span
                  className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                    order.status
                  )}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className="mb-4">
                <span className="text-gray-500">Payment Status:</span>
                <span
                  className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(
                    order.paymentStatus
                  )}`}
                >
                  {order.paymentStatus.charAt(0).toUpperCase() +
                    order.paymentStatus.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          {order.items.map((item) => (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row items-start sm:items-center py-4 border-b last:border-0"
            >
              <div className="relative w-20 h-20 mb-4 sm:mb-0 mr-4">
                <Image
                  src={
                    item.product.images[0].startsWith("/uploads")
                      ? item.product.images[0]
                      : "/placeholder.jpg"
                  }
                  alt={item.product.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <Link
                  href={`/product/${item.product.slug}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>
              <div className="text-right mt-2 sm:mt-0">
                <p className="font-medium">₹{item.price.toLocaleString()}</p>
                <p className="text-sm text-gray-500">
                  Total: ₹{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          ))}

          <div className="mt-6">
            <div className="flex justify-between py-2 border-t text-lg">
              <span className="font-semibold">Order Total</span>
              <span className="font-bold">
                ₹{order.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Shipping Address</h3>
              <div className="text-gray-700">
                <p className="font-semibold">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p>Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Payment Method</h3>
              <p className="text-gray-700">{order.paymentMethod}</p>
            </div>
          </div>
        </div>

        {/* Need Help */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
          <p className="mb-4">
            If you have any questions or concerns about your order, please
            contact our customer service team.
          </p>
          <Link href="/contact">
            <Button variant="outline">Contact Us</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
