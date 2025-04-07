import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import bcrypt from "bcryptjs";

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

    const jwtToken = createJwtToken(user);
    res.status(200).json({ token: jwtToken, user });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// User registration for manual login
export const register = async (req, res) => {
  const { email, password, fullName, phone, role } = req.body;
  console.log(req.body);
  try {
    let user = await User.findOne({ email });
    if (user) {
      console.log("User already exists")
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    user = new User({
      email,
      phone,
      password: hashedPassword,
      fullName,
      role,
    });
    await user.save();
    console.log(user)
    const jwtToken = createJwtToken(user);
    res.status(201).json({ token: jwtToken, user });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Server error" });
  }
};

