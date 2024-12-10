import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export const register = async (req, res) => {
  const { email, fullName, password, profilePic } = req.body;
  try {
    if (password < 6)
      res.status(400).json({ message: "Password is less than 6 characters" });
    if (!email || !fullName || !password) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
      profilePic,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        userId: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).send({ message: "Invalid user data." });
    }
  } catch (error) {
    console.log("Error in register controller.");
    res.status(500).json({ error: `${error.message}` });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Wrong credentials" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Wrong credentials" });

    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      userId: user._id,
      email: user.email,
      fullName: user.fullName,
      profilPic: user.profilPic,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in login controller.");
  }
};
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};