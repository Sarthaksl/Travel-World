import User from "../models/User.js";
import bcrypt from "bcrypt"; // Import bcrypt to hash passwords
import jwt from "jsonwebtoken"; // Import jwt for token generation

// Create a new user
export const createUser = async (req, res) => {
  const { username, email, password, role } = req.body; // Destructure role from request body

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user, setting role to 'admin' if provided, otherwise 'user'
    const newUser = new User({ 
      username,
      email,
      password: hashedPassword,
      role: role || 'user' // Default role is 'user'
    });

    const savedUser = await newUser.save();

    // Generate a JWT token after creating the user
    const token = jwt.sign({ userId: savedUser._id, role: savedUser.role }, process.env.JWT_SECRET, { expiresIn: '15d' });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: savedUser,
      token, // Send the generated token in response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create user" });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to get users" });
  }
};

// Get a single user by ID
export const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to get user" });
  }
};

// Update a user
export const updateUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update user" });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    await User.findByIdAndDelete(userId);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};

export default {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};