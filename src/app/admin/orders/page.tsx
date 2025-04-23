"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Order status badge colors
const statusColors = {
  pending: "bg-yellow-500",
  processing: "bg-blue-500",
  shipped: "bg-purple-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
};

// Payment status badge colors
const paymentStatusColors = {
  pending: "bg-yellow-500",
  paid: "bg-green-500",
  failed: "bg-red-500",
};

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
  name?: string;
  email: string;
}

interface OrderItem {
  _id: string;
  product: {
    name: string;
  };
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  paymentMethod: string;
  totalAmount: number;
  createdAt: string;
  user: User;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/orders");

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on active tab
  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => order.status === activeTab);

  // Update order status
  const updateOrderStatus = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      // Update local state after successful API call
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update order status");
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-2xl font-semibold">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-2xl font-semibold text-red-500">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Order Management</h1>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl font-medium text-gray-600">
                No orders found
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredOrders.map((order) => (
                <Card key={order._id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50">
                    <div className="flex flex-wrap justify-between items-center">
                      <div>
                        <CardTitle className="text-lg">
                          Order #{order._id.substring(order._id.length - 8)}
                        </CardTitle>
                        <p className="text-sm text-gray-500">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex gap-2 mt-2 sm:mt-0">
                        <Badge className={statusColors[order.status]}>
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </Badge>
                        <Badge
                          className={paymentStatusColors[order.paymentStatus]}
                        >
                          Payment: {order.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Customer Information */}
                      <div>
                        <h3 className="font-semibold mb-2">Customer</h3>
                        <p>{order.user.name || "Name not available"}</p>
                        <p>{order.user.email}</p>
                      </div>

                      {/* Shipping Information */}
                      <div>
                        <h3 className="font-semibold mb-2">Shipping Address</h3>
                        <p>{order.shippingAddress.name}</p>
                        <p>{order.shippingAddress.street}</p>
                        <p>
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state}{" "}
                          {order.shippingAddress.postalCode}
                        </p>
                        <p>{order.shippingAddress.country}</p>
                        <p>Phone: {order.shippingAddress.phone}</p>
                      </div>

                      {/* Payment Information */}
                      <div>
                        <h3 className="font-semibold mb-2">Payment Details</h3>
                        <p>Method: {order.paymentMethod}</p>
                        <p>Status: {order.paymentStatus}</p>
                        <p className="font-semibold mt-2">
                          Total: ₹{order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Order Items */}
                    <h3 className="font-semibold mb-4">Order Items</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left">Product</th>
                            <th className="px-4 py-2 text-right">Price</th>
                            <th className="px-4 py-2 text-right">Quantity</th>
                            <th className="px-4 py-2 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {order.items.map((item) => (
                            <tr key={item._id}>
                              <td className="px-4 py-3">{item.product.name}</td>
                              <td className="px-4 py-3 text-right">
                                ₹{item.price.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 text-right">
                                {item.quantity}
                              </td>
                              <td className="px-4 py-3 text-right">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="font-semibold">
                          <tr>
                            <td colSpan={3} className="px-4 py-3 text-right">
                              Total
                            </td>
                            <td className="px-4 py-3 text-right">
                              ₹{order.totalAmount.toFixed(2)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    <Separator className="my-6" />

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 justify-end">
                      {order.status === "pending" && (
                        <Button
                          onClick={() =>
                            updateOrderStatus(order._id, "processing")
                          }
                          variant="outline"
                        >
                          Mark as Processing
                        </Button>
                      )}
                      {order.status === "processing" && (
                        <Button
                          onClick={() =>
                            updateOrderStatus(order._id, "shipped")
                          }
                          variant="outline"
                        >
                          Mark as Shipped
                        </Button>
                      )}
                      {order.status === "shipped" && (
                        <Button
                          onClick={() =>
                            updateOrderStatus(order._id, "delivered")
                          }
                          variant="outline"
                        >
                          Mark as Delivered
                        </Button>
                      )}
                      {order.status !== "cancelled" &&
                        order.status !== "delivered" && (
                          <Button
                            onClick={() =>
                              updateOrderStatus(order._id, "cancelled")
                            }
                            variant="destructive"
                          >
                            Cancel Order
                          </Button>
                        )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
