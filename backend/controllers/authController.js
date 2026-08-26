import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ================= REGISTER ================= */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.json({ message: "Registration successful", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= LOGIN (EMAIL + PASSWORD) ================= */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= GOOGLE LOGIN ================= */
export const googleLogin = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email is required" });

    let user = await User.findOne({ email });

    // 🔹 If user not exists → create new user
    if (!user) {
      user = await User.create({
        name,
        email,
        password: "google-auth", // dummy password
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Google login successful",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
