import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcryptjs";

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  console.log("body: ",req.body)

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Fields that can be updated
  const { fullName, phone, newPassword, confirmPassword } = req.body;

  // Check if email is being attempted to be changed
  if (req.body.email && req.body.email !== user.email) {
    res.status(400);
    throw new Error("Email cannot be changed");
  }
  if (req.body.role && req.body.role !== user.role) {
    res.status(400);
    throw new Error("Role cannot be changed");
  }


  // Update basic fields
  if (fullName) user.fullName = fullName;
  if (phone) user.phone = phone;

  // Handle password change if provided
  if (newPassword) {
    // Validate password confirmation
    if (newPassword !== confirmPassword) {
      res.status(400);
      throw new Error("Passwords do not match");
    }

    // Hash the new password
    user.password = await bcrypt.hash(newPassword, 12);

    console.log(user)
    
  }

  // Save the updated user
  const updatedUser = await user.save();
  console.log(updatedUser)

  res.status(200).json({
    success: true,
    data: {
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
    },
    message: "Profile updated successfully",
  });
});
