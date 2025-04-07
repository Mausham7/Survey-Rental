import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  paymentMethod: {
    type: String,
    default: "COD",
  },
  orderStatus: {
    type: String,
    default: "processing",
    enum: ["processing", "shipped", "delivered", "completed", "cancelled"],
  },

  fullName: {
    type: String,
    required: true,
  },
  citizenID: {
    type: String,
    required: true,
  },

  streetAddress: {
    type: String,
    required: true,
  },
  coordinates: {
    type: String,
  },

  townCity: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    default: "+977 9800000000",
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },

  quantity: {
    type: Number,
    default: 1,
  },

  days: {
    type: Number,
    default: 1,
  },
  total: {
    type: Number,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },

  pName: {
    type: String,
    required: true,
  },
  detail: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  deliveryDate: {
    type: Date,
    default: Date.now,
  },
});

export const Order = mongoose.model("Order", orderSchema);
