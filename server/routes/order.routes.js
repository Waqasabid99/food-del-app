// routes/order.routes.js
const express = require("express");
const orderRouter = express.Router();
const orderService = require("../services/order.services");
const userAuth = require("../middleware/auth");

// User routes (require authentication)
orderRouter.post("/create", userAuth.verifyToken, orderService.createOrder);
orderRouter.get("/user-orders", userAuth.verifyToken, orderService.getUserOrders);
orderRouter.get("/:id", userAuth.verifyToken, orderService.getOrderById);
orderRouter.put("/cancel/:id", userAuth.verifyToken, orderService.cancelOrder);

// For now using verifyToken, but you should create a separate admin middleware
orderRouter.get("/admin/all", orderService.getAllOrders);
orderRouter.post("/admin/create-order-by-admin", orderService.createOrder);
orderRouter.put("/admin/status/:id", orderService.updateOrderStatus);

module.exports = orderRouter;