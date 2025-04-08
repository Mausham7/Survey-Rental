import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  pName: {
    type: String,
    required: true,
  },
  detail: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
    default: "survey",
  },
  rating: {
    type: Number,
    default: 0,
  },
  NumberOfReview: {
    type: Number,
    default: 0,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  inFlashSale: {
    type: Boolean,
    default: false,
  },

  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
    required: true,
  },
});

export const Product = mongoose.model("Product", productSchema);
