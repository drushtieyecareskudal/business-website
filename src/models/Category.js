import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  order: {
    type: Number,
    default: 0,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

// Prevent model recompilation during development with Next.js hot reloading
const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
