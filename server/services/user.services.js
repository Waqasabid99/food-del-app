require("dotenv").config();
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "secret", {
    expiresIn: "1d",
  });
};

//CreateUser
const createUser = async (req, res) => {
  const { name, phone, password } = req.body;
  try {
    // Check if user exists by phone
    const exists = await userModel.findOne({ phone });

    if (exists) {
      return res
        .status(400)
        .json({ message: "User with this phone number already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await userModel.create({
      name,
      phone,
      password: hashedPassword,
    });

    // Generate JWT
    const token = createToken(user._id);

    res.status(201).json({ message: "User created successfully", user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//LoginUser
const loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Find user by phone
    const user = await userModel.findOne({ phone });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid phone number or password" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid phone number or password" });
    }

    const token = createToken(user._id);

    res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//GetuserbyID
const getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).select("-password"); // don't send password back
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//UpdateUser
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    // Validate that user is updating their own profile or is admin
    if (req.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this profile" });
    }

    // Remove sensitive fields that shouldn't be updated this way
    delete updateData.password;
    delete updateData._id;
    delete updateData.createdAt;

    // If phone number is being updated, check if it's already taken by another user
    if (updateData.phone) {
      const existingUser = await userModel.findOne({
        phone: updateData.phone,
        _id: { $ne: userId },
      });

      if (existingUser) {
        return res.status(400).json({ message: "Phone number already in use" });
      }
    }

    // Update the user
    const updatedUser = await userModel
      .findByIdAndUpdate(
        userId,
        {
          ...updateData,
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      )
      .select("-password"); // Don't return password

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//logoutUser

const logoutUser = async (req, res) => {
  try {
    // Stateless JWT -> just instruct client to remove token
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//getallusers
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//deleteUser
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await userModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createUser,
  loginUser,
  getUserById,
  logoutUser,
  updateUser,
  getAllUsers,
  deleteUser,
};
