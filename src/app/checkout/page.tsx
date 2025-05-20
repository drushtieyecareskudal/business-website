"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Image from "next/image";

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    discountedPrice?: number;
    images: string[];
    inStock: boolean;
  };
  quantity: number;
}

interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
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

interface PaymentInfo {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Confirmation
  const [subtotal, setSubtotal] = useState(0);

  // Form states
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phone: "",
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  // Fetch cart data when component mounts or user changes
  useEffect(() => {
    const fetchCart = async () => {
      if (!authLoading) {
        if (!user) {
          // Redirect to login if not authenticated
          router.push("/login?redirect=/checkout");
          return;
        }

        setLoading(true);
        try {
          const response = await fetch("/api/cart");
          if (!response.ok) {
            throw new Error("Failed to fetch cart");
          }
          const cartData = await response.json();

          if (
            !cartData ||
            !cartData.cart ||
            !cartData.cart.items ||
            cartData.cart.items.length === 0
          ) {
            toast.error(
              "Your cart is empty. Please add products to your cart first."
            );
            router.push("/cart");
            return;
          }

          setCart(cartData.cart); // Calculate subtotal
          const calculatedSubtotal = cartData.cart.items.reduce(
            (acc: number, item: CartItem) => {
              const price = item.product.discountedPrice || item.product.price;
              return acc + price * item.quantity;
            },
            0
          );

          setSubtotal(calculatedSubtotal);
        } catch (error) {
          console.error("Error fetching cart:", error);
          toast.error("Error loading cart data");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCart();
  }, [user, authLoading, router]);

  // Handle address form input change
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress({
      ...shippingAddress,
      [name]: value,
    });
  };

  // Handle payment form input change
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo({
      ...paymentInfo,
      [name]: value,
    });
  };

  // Validate address form
  const validateAddressForm = () => {
    const { name, street, city, state, postalCode, phone } = shippingAddress;
    if (!name || !street || !city || !state || !postalCode || !phone) {
      toast.error("Please fill in all required fields");
      return false;
    }

    // Basic phone validation
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }

    return true;
  };

  // Validate payment form
  const validatePaymentForm = () => {
    const { cardNumber, cardHolder, expiryDate, cvv } = paymentInfo;
    if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
      toast.error("Please fill in all payment details");
      return false;
    }

    // Basic card validation
    if (cardNumber.replace(/\s/g, "").length !== 16) {
      toast.error("Please enter a valid 16-digit card number");
      return false;
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      toast.error("Please enter a valid CVV");
      return false;
    }

    return true;
  };

  // Handle proceed to payment
  const handleProceedToPayment = () => {
    if (validateAddressForm()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  // Handle back to address
  const handleBackToAddress = () => {
    setStep(1);
    window.scrollTo(0, 0);
  };

  // Process order
  const handlePlaceOrder = async () => {
    if (!validatePaymentForm()) return;

    setProcessingOrder(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Create order
      console.log("Preparing to create order with data:", {
        itemsCount: cart?.items.length,
        totalAmount: subtotal,
      });

      const orderPayload = {
        shippingAddress,
        paymentMethod: "Credit Card", // In a real app, you might want to allow selection
        items: cart?.items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.discountedPrice || item.product.price,
        })),
        totalAmount: subtotal,
      };

      console.log("Sending order data:", JSON.stringify(orderPayload));

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });
      console.log("Order API response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error response:", errorData);
        throw new Error(errorData.message || "Failed to create order");
      }

      const orderData = await response.json();
      console.log("Order created successfully:", orderData);

      // Clear cart after successful order
      await fetch("/api/cart", {
        method: "DELETE",
      });

      // Show success and redirect to order confirmation
      toast.success("Order placed successfully!");
      router.push(
        `/orders/${orderData.success ? orderData.order._id : orderData._id}`
      );
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setProcessingOrder(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container py-8 px-4">
        <div className="flex flex-col items-center justify-center h-60">
          <div className="mb-4">Loading checkout information...</div>
        </div>
      </div>
    );
  }

  // Order summary component (used in multiple steps)
  const OrderSummary = () => (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <h2 className="font-semibold text-lg mb-4">Order Summary</h2>

      {cart &&
        cart.items.map((item) => (
          <div key={item._id} className="flex items-center py-4 border-b">
            <div className="relative w-16 h-16 mr-4">
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
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">
                ₹
                {(
                  (item.product.discountedPrice || item.product.price) *
                  item.quantity
                ).toLocaleString()}
              </p>
            </div>
          </div>
        ))}

      <div className="space-y-3 mt-4">
        <div className="flex justify-between pb-3 border-b">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">₹{subtotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between pb-3 border-b">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium text-green-600">Free</span>
        </div>

        <div className="flex justify-between pb-3 text-lg font-bold">
          <span>Total</span>
          <span>₹{subtotal.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      {/* Checkout Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 1 ? "bg-blue-600 text-white" : "bg-gray-300"
            }`}
          >
            1
          </div>
          <span className={step >= 1 ? "font-medium" : "text-gray-500"}>
            Shipping
          </span>

          <div className="w-12 h-1 bg-gray-300">
            <div
              className={`h-full ${step >= 2 ? "bg-blue-600" : "bg-gray-300"}`}
            ></div>
          </div>

          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 2 ? "bg-blue-600 text-white" : "bg-gray-300"
            }`}
          >
            2
          </div>
          <span className={step >= 2 ? "font-medium" : "text-gray-500"}>
            Payment
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-2">
          {/* Step 1: Shipping Address */}
          {step === 1 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={shippingAddress.name}
                    onChange={handleAddressChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    name="street"
                    value={shippingAddress.street}
                    onChange={handleAddressChange}
                    placeholder="Enter your street address"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleAddressChange}
                      placeholder="Enter your city"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleAddressChange}
                      placeholder="Enter your state"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={handleAddressChange}
                      placeholder="Enter your postal code"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleAddressChange}
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleAddressChange}
                    placeholder="Enter your 10-digit phone number"
                    required
                  />
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={handleProceedToPayment}
                >
                  Proceed to Payment
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Payment Information */}
          {step === 2 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">
                Payment Information
              </h2>
              {/*
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>Demo Mode:</strong> This is a simulation. No real
                  payment will be processed.
                </p>
              </div>
              */}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={handlePaymentChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>

                <div>
                  <Label htmlFor="cardHolder">Card Holder Name</Label>
                  <Input
                    id="cardHolder"
                    name="cardHolder"
                    value={paymentInfo.cardHolder}
                    onChange={handlePaymentChange}
                    placeholder="Enter name on card"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date (MM/YY)</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      value={paymentInfo.expiryDate}
                      onChange={handlePaymentChange}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      value={paymentInfo.cvv}
                      onChange={handlePaymentChange}
                      placeholder="123"
                      maxLength={4}
                      type="password"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={handleBackToAddress}>
                    Back to Shipping
                  </Button>

                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handlePlaceOrder}
                    disabled={processingOrder}
                  >
                    {processingOrder ? "Processing..." : "Place Order"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary />

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              By placing your order, you agree to our{" "}
              <Link href="/policies" className="text-blue-600 hover:underline">
                terms and conditions
              </Link>
              . You can review our full policies, including refunds and shipping
              information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
