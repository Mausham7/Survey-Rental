import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import bcrypt from "bcryptjs";
import sendEmail from "../middlewares/sendEmail.js";
import crypto from "crypto";

const createJwtToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Manual email-password login
export const manualLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.emailVerified != true) {
      return res.status(401).json({ error: "Email not verified", verified: false });
    }

    const jwtToken = createJwtToken(user);
    res.status(200).json({ token: jwtToken, user });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// User registration for manual login
export const register = async (req, res) => {
  const { email, password, fullName, phone, role } = req.body;
  console.log(req.body);
  try {
    let user = await User.findOne({ email });
    if (user) {
      console.log("User already exists");
      return res.status(400).json({ error: "User already exists" });
    }

    // Generate verification token (no expiry)
    const verificationToken = generateVerificationToken();

    const hashedPassword = await bcrypt.hash(password, 12);
    user = new User({
      email,
      phone,
      password: hashedPassword,
      fullName,
      role,
      emailVerificationToken: verificationToken,
      // No expiration date set
    });
    await user.save();
    console.log(user);

    const jwtToken = createJwtToken(user);

    // Create verification URL (replace with your actual frontend/backend URL)
    const verificationUrl = `${"http://localhost:4000"}/api/v1/verify-email/${
      user.emailVerificationToken
    }`;

    // Send verification email
    await sendEmail({
      email: email,
      subject: "Please verify your email address",
      message: `
        Dear ${fullName},
        
        Thank you for registering with our service. Please click the link below to verify your email address:
        
        ${verificationUrl}
        
        This verification link does not expire, so you can use it whenever it's convenient.
        
        Best regards,
        Your Survey Rental Team
      `,
    });

    res.status(201).json({
      token: jwtToken,
      user,
      message:
        "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Updated verify email endpoint without expiration check
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Find user with the given verification token (no expiration check)
    const user = await User.findOne({
      emailVerificationToken: token,
    });

    if (!user) {
      return res.status(400).json({
        error: "Invalid verification token",
      });
    }

    // Check if already verified
    if (user.emailVerified) {
      return res.status(200).json({
        message: "Email already verified",
      });
    }

    // Update user
    user.emailVerified = true;
    user.emailVerificationToken = undefined; // Still remove the token after verification
    await user.save();

    // Return success
    return res.status(200).json({
      message: "Email verified successfully",
    });

    // Alternative: redirect to frontend
    // return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/email-verified`);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Server error",
    });
  }
};

// Function to resend verification email if needed
export const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        error: "Email already verified",
      });
    }

    // If no token exists or we want to generate a new one
    if (!user.emailVerificationToken) {
      user.emailVerificationToken = generateVerificationToken();
      await user.save();
    }

    const verificationUrl = `${"http://localhost:4000"}/api/v1/verify-email/${
      user.emailVerificationToken
    }`;

    await sendEmail({
      email: user.email,
      subject: "Please verify your email address",
      message: `
        Dear ${user.fullName},
        
        Here's your email verification link again:
        
        ${verificationUrl}
        
        This verification link does not expire.
        
        Best regards,
        Your Survey Rental Team
      `,
    });

    return res.status(200).json({
      message: "Verification email resent successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Server error",
    });
  }
};
