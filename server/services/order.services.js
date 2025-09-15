// services/order.services.js
const orderModel = require("../models/order.model");
const userModel = require("../models/user.model");

const createOrder = async (req, res) => {
  try {
    const userId =  req.body.userId || req.params.userId; // From auth middleware
    const {
      items,
      deliveryAddress,
      contactInfo,
      paymentMethod,
      pricing,
      specialInstructions
    } = req.body;

    // Validate required fields
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.zipCode) {
      return res.status(400).json({ message: "Complete delivery address is required" });
    }

    if (!contactInfo || !contactInfo.phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    if (!paymentMethod || !['card', 'cash'].includes(paymentMethod)) {
      return res.status(400).json({ message: "Valid payment method is required" });
    }

    if (!pricing || typeof pricing.total !== 'number') {
      return res.status(400).json({ message: "Valid pricing information is required" });
    }

    // Get user details
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create order
    const order = await orderModel.create({
      userId,
      items: items.map(item => ({
        foodId: item.id || item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      deliveryAddress: {
        street: deliveryAddress.street,
        city: deliveryAddress.city,
        zipCode: deliveryAddress.zipCode
      },
      contactInfo: {
        phone: contactInfo.phone,
        email: contactInfo.email || user.email || ""
      },
      paymentMethod,
      pricing: {
        subtotal: pricing.subtotal,
        deliveryFee: pricing.deliveryFee || 2.99,
        tax: pricing.tax,
        total: pricing.total
      },
      specialInstructions: specialInstructions || ""
    });

    // Populate the order with user details
    const populatedOrder = await orderModel.findById(order._id).populate('userId', 'name email phone');

    res.status(201).json({
      message: "Order placed successfully",
      order: populatedOrder,
      orderNumber: order.orderNumber
    });

  } catch (error) {
    console.error("Create order error:", error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(500).json({ message: "Order number conflict. Please try again." });
    }
    
    res.status(500).json({ message: "Internal server error" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.userId || req.params.userId || req.body.userId;

    // Validate ObjectId format
    if (!orderId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid order ID format" });
    }

    const order = await orderModel.findOne({
      _id: orderId,
      userId: userId // Ensure user can only access their own orders
    }).populate('userId', 'name email phone');

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });

  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10)); // Limit max to 50
    const skip = (page - 1) * limit;

    const orders = await orderModel.find({ userId })
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await orderModel.countDocuments({ userId });

    res.status(200).json({
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        hasNext: page < Math.ceil(totalOrders / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    // Validate ObjectId format
    if (!orderId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid order ID format" });
    }

    const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const updateData = { status };
    
    // Set actual delivery time when order is delivered
    if (status === 'delivered') {
      updateData.actualDeliveryTime = new Date();
    }

    const order = await orderModel.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'name email phone');

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order
    });

  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.userId;

    // Validate ObjectId format
    if (!orderId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid order ID format" });
    }

    const order = await orderModel.findOne({
      _id: orderId,
      userId: userId
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only allow cancellation if order is still pending or confirmed
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ 
        message: "Order cannot be cancelled at this stage",
        currentStatus: order.status 
      });
    }

    order.status = 'cancelled';
    await order.save();

    // Populate user data for response
    await order.populate('userId', 'name email phone');

    res.status(200).json({
      message: "Order cancelled successfully",
      order
    });

  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Admin functions (require admin middleware)
const getAllOrders = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10)); // Limit max to 100 for admin
    const status = req.query.status;
    const skip = (page - 1) * limit;

    let filter = {};
    
    // Validate status filter if provided
    if (status) {
      const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
      if (validStatuses.includes(status)) {
        filter.status = status;
      }
    }

    const orders = await orderModel.find(filter)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await orderModel.countDocuments(filter);

    res.status(200).json({
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        hasNext: page < Math.ceil(totalOrders / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  cancelOrder,
  getAllOrders
};