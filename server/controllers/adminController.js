import jwt from 'jsonwebtoken';
import 'dotenv/config';
import User from '../models/User.js';

// Signup
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Create user
    const newUser = await User.create({
      name,
      email,
      password,
      isDemo: false
    });

    // Generate token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, isDemo: false },
      process.env.JWT_SECRET
    );

    res.json({ success: true, token, message: "Signup successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Demo login check
    if (email === "demo@blog.com" && password === "demo123") {
      const token = jwt.sign({ email, isDemo: true }, process.env.JWT_SECRET);
      return res.json({ success: true, token });
    }

    // Normal login
    const token = jwt.sign(
      { id: user._id, email: user.email, isDemo: false },
      process.env.JWT_SECRET
    );

    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
