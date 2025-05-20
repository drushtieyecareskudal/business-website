import mongoose, { Schema, Document, Model } from "mongoose";

// Define TypeScript interfaces for the schemas
export interface OrderItemInterface {
  product: mongoose.Schema.Types.ObjectId | string;
  quantity: number;
  price: number;
  _id?: string;
}

export interface ShippingAddressInterface {
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface OrderInterface extends Document {
  user: mongoose.Schema.Types.ObjectId | string;
  items: OrderItemInterface[];
  totalAmount: number;
  shippingAddress: ShippingAddressInterface;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

// Create the Mongoose schemas
const orderItemSchema = new Schema<OrderItemInterface>({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new Schema<OrderInterface>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    name: String,
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phone: String,
  },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add validation error handling
orderSchema.pre("validate", function (next) {
  console.log("Validating order:", {
    hasUser: !!this.user,
    itemsCount: this.items ? this.items.length : 0,
    hasTotalAmount: !!this.totalAmount,
    hasShippingAddress: !!this.shippingAddress,
    paymentMethod: this.paymentMethod,
    status: this.status,
  });
  next();
});

// Update the updatedAt timestamp before saving
orderSchema.pre("save", function (next) {
  console.log("Saving order with ID:", this._id);
  this.updatedAt = new Date();
  next();
});

// Prevent model recompilation during development with Next.js hot reloading
const Order: Model<OrderInterface> = 
  mongoose.models.Order as Model<OrderInterface> || 
  mongoose.model<OrderInterface>("Order", orderSchema);

export default Order;
