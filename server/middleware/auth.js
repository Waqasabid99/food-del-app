// middleware/auth.js
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const verifyToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: "Access denied. No token provided or invalid format." 
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        message: "Access denied. Token is missing." 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    
    // Check if user still exists
    const user = await userModel.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        message: "Token is valid but user no longer exists" 
      });
    }

    // Add user ID to request object for use in route handlers
    req.userId = decoded.userId;
    req.user = user;
    
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: "Invalid token" 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: "Token has expired" 
      });
    }

    console.error("Auth middleware error:", error);
    return res.status(500).json({ 
      message: "Internal server error during authentication" 
    });
  }
};

// Admin verification middleware
const verifyAdmin = async (req, res, next) => {
  try {
    // First verify the token
    await verifyToken(req, res, () => {});
    
    // Check if user has admin role
    if (!req.user.isAdmin) {
      return res.status(403).json({ 
        message: "Access denied. Admin privileges required." 
      });
    }
    
    next();

  } catch (error) {
    console.error("Admin verification error:", error);
    return res.status(500).json({ 
      message: "Internal server error during admin verification" 
    });
  }
};

module.exports = { 
  verifyToken, 
  verifyAdmin 
};