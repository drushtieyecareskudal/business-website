"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OrderItem {
  _id: string;
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

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Order {
  _id: string;
  user: User;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!authLoading) {
        if (!user) {
          // Redirect to login if not authenticated
          router.push("/login?redirect=/admin/orders");
          return;
        }
        if (user.role !== "admin") {
          // Redirect to home if not admin
          router.push("/");
          toast.error("You don't have permission to access this page");
          return;
        }

        setLoading(true);
        try {
          const response = await fetch(`/api/admin/orders/${params.id}`);
          if (!response.ok) {
            if (response.status === 404) {
              toast.error("Order not found");
              router.push("/admin/orders");
              return;
            }
            throw new Error("Failed to fetch order");
          }

          const orderData = await response.json();
          setOrder(orderData);
        } catch (error) {
          console.error("Error fetching order:", error);
          toast.error("Error loading order data");
        } finally {
          setLoading(false);
        }
      }
    };

    if (params.id) {
      fetchOrder();
    }
  }, [user, authLoading, router, params.id]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  // Update order status
  const updateOrderStatus = async (status: string) => {
    if (!order) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${order._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      const updatedOrder = await response.json();
      setOrder(updatedOrder);
      toast.success("Order status updated successfully");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  // Update payment status
  const updatePaymentStatus = async (paymentStatus: string) => {
    if (!order) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${order._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update payment status");
      }

      const updatedOrder = await response.json();
      setOrder(updatedOrder);
      toast.success("Payment status updated successfully");
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Failed to update payment status");
    } finally {
      setUpdating(false);
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
          <Link href="/admin/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <Link href="/admin/orders">
          <Button variant="outline">Back to Orders</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Overview */}
        <Card className="col-span-2">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Order #{order._id}
                </h2>
                <p className="text-gray-500">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
              <Badge
                variant={order.status === "delivered" ? "default" : "outline"}
                className="text-sm"
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label className="text-sm text-gray-500">Order Status</Label>
                <Select
                  defaultValue={order.status}
                  onValueChange={updateOrderStatus}
                  disabled={updating}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm text-gray-500">Payment Status</Label>
                <Select
                  defaultValue={order.paymentStatus}
                  onValueChange={updatePaymentStatus}
                  disabled={updating}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Payment Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item._id} className="flex items-start">
                    <div className="relative w-16 h-16 mr-4">
                      <Image
                        src={
                          item.product.images?.[0]?.startsWith("/uploads")
                            ? item.product.images[0]
                            : "/placeholder.jpg"
                        }
                        alt={item.product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="hover:text-blue-600"
                          target="_blank"
                        >
                          {item.product.name}
                        </Link>
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right min-w-20">
                      <p className="font-medium">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    ₹{order.totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between py-2 text-lg font-bold">
                  <span>Total</span>
                  <span>₹{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Customer Details</h3>
              <div className="space-y-2">
                <p>
                  <span className="text-gray-500">Name:</span>{" "}
                  <span className="font-medium">{order.user.name}</span>
                </p>
                <p>
                  <span className="text-gray-500">Email:</span>{" "}
                  <span>{order.user.email}</span>
                </p>
              </div>

              {/* Send Email Button */}
              <Button
                className="w-full mt-4"
                variant="outline"
                onClick={() => {
                  window.open(
                    `mailto:${order.user.email}?subject=Your Order ${order._id}&body=Hello ${order.user.name},%0D%0A%0D%0AThank you for your order.%0D%0A%0D%0ARegards,%0D%0ADrushti Eye Care Team`
                  );
                }}
              >
                Email Customer
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Shipping Details</h3>
              <div className="space-y-1">
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p className="mt-2">
                  <span className="text-gray-500">Phone:</span>{" "}
                  {order.shippingAddress.phone}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Payment Information</h3>
              <p>
                <span className="text-gray-500">Method:</span>{" "}
                <span className="font-medium">{order.paymentMethod}</span>
              </p>
              <p>
                <span className="text-gray-500">Status:</span>{" "}
                <Badge
                  variant={
                    order.paymentStatus === "paid" ? "default" : "secondary"
                  }
                >
                  {order.paymentStatus.charAt(0).toUpperCase() +
                    order.paymentStatus.slice(1)}
                </Badge>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => {
            window.print();
          }}
        >
          Print Order
        </Button>

        {order.status === "delivered" ? (
          <Button variant="default" disabled>
            Order Complete
          </Button>
        ) : order.status === "cancelled" ? (
          <Button variant="destructive" disabled>
            Order Cancelled
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={() =>
              updateOrderStatus(
                order.status === "pending"
                  ? "processing"
                  : order.status === "processing"
                  ? "shipped"
                  : "delivered"
              )
            }
            disabled={updating}
          >
            {updating
              ? "Updating..."
              : order.status === "pending"
              ? "Mark as Processing"
              : order.status === "processing"
              ? "Mark as Shipped"
              : "Mark as Delivered"}
          </Button>
        )}
      </div>
    </div>
  );
}
