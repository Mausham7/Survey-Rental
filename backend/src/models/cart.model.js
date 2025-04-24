import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  days: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  price: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  pName: {
    type: String,
    required: true
  },
  detail: {
    type: String,
    default: ""
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  image: {
    type: String
  }
});

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [CartItemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to update the 'updatedAt' field
CartSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to calculate cart total
CartSchema.methods.calculateTotal = function() {
  return this.items.reduce((sum, item) => sum + item.total, 0);
};

export const Cart = mongoose.model("Cart", CartSchema);