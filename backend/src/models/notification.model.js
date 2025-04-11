import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  // Who the notification is for
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "recipientModel",
  },
  // Allows for different recipient types (User, Admin)
  recipientModel: {
    type: String,
    required: true,
    enum: ["User", "Admin"],
  },
  // Related order (if applicable)
  trackingNumber: {
    type: String,
  },
  // Title of notification
  title: {
    type: String,
    required: true,
  },
  // Message content
  message: {
    type: String,
    required: true,
  },
  // Type of notification for styling/filtering
  type: {
    type: String,
    enum: [
      "order_placed",
      "order_status_change",
      "payment_received",
      "system",
      "other",
    ],
    default: "system",
  },
  // Has the user seen it
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create indexes for faster queries
notificationSchema.index({ recipientId: 1 });
notificationSchema.index({ isRead: 1 });
notificationSchema.index({ createdAt: -1 });

export const Notification = mongoose.model("Notification", notificationSchema);
