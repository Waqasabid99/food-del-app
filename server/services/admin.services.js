const adminModal = require('../models/admin.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Create JWT
const createToken = (adminId) => {
    return jwt.sign(
        { adminId },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "1d" }
    );
}

//Create new admin
const createAdmin = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if admin exists by email
        const exists = await adminModal.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: "Admin already exists" });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create new admin
        const admin = await adminModal.create({ name, email, password: hashedPassword });
        // Generate JWT
        const token = createToken(admin._id);
        res.status(201).json({ message: "Admin created successfully", admin, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

//Admin Login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find admin by email
        const admin = await adminModal.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        // Validate password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = createToken(admin._id);
        res.status(200).json({ message: "Login successful", admin, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

//Get all admins
const getAllAdmins = async (req, res) => {
    try {
        const admins = await adminModal.find();
        res.status(200).json({ admins });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

//Get single admin
const getAdminById = async (req, res) => {
    try {
        const admin = await adminModal.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        res.status(200).json({ admin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

//Update admin
const updateAdmin = async (req, res) => {
    try {
        const admin = await adminModal.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        res.status(200).json({ admin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

//Admin logout
const logoutAdmin = async (req, res) => {
    try {
        // Stateless JWT -> just instruct client to remove token
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    createAdmin,
    loginAdmin,
    getAllAdmins,
    getAdminById,
    updateAdmin,
    logoutAdmin
}