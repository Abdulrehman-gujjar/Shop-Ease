const express = require("express");

const protect = require("../middleware/authMiddleware");
const adminProtect = require("../middleware/adminMiddleware");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const router = express.Router();

// ===============================
// CUSTOMER ORDERS
// ===============================

// Create order
router.post("/", protect, createOrder);

// Get logged-in user's orders
router.get("/my-orders", protect, getMyOrders);

// Get single user's order
router.get("/:id", protect, getOrderById);


// ===============================
// ADMIN ORDERS
// ===============================

// Get all customer orders
router.get("/admin/all", adminProtect, getAllOrders);

// Update order status
router.put(
  "/admin/:id/status",
  adminProtect,
  updateOrderStatus
);

module.exports = router;