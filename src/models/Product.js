import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    default: "",
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  colors: {
    type: [String],
    default: [],
  },
  bestSeller: {
    type: Boolean,
    default: false,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent model recompilation during development with Next.js hot reloading
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
