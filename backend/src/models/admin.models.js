import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  catagory: {
    type: String,
    required: true,
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
  password: {
    type: String,
  },

  phone: {
    type: String,
    default: "+977 9800000000",
  },

  role: {
    type: String,
    enum: ["admin", "customer"],
    default: "client",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model("User", userSchema);
