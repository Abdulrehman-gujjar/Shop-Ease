const jwt = require("jsonwebtoken");

const Chat = require("../models/Chat");
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

// =========================
// ADMIN LOGIN
// =========================

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const ADMIN_EMAIL = "admin@gmail.com";
    const ADMIN_PASSWORD = "admin123";

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    if (
      email.trim().toLowerCase() !== ADMIN_EMAIL ||
      password !== ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        message: "Invalid admin email or password",
      });
    }

    const token = jwt.sign(
      {
        email: ADMIN_EMAIL,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Admin login successful",
      token,
      admin: {
        email: ADMIN_EMAIL,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    res.status(500).json({
      message: "Admin login failed",
      error: error.message,
    });
  }
};

// =========================
// ADMIN DASHBOARD STATS
// =========================

const getAdminStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    const totalOrders = await Order.countDocuments();

    const totalCustomers = await User.countDocuments();

    const salesResult = await Order.aggregate([
      {
        $match: {
          status: {
            $ne: "Cancelled",
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: {
            $sum: "$totalPrice",
          },
        },
      },
    ]);

    const totalSales =
      salesResult.length > 0
        ? salesResult[0].totalSales
        : 0;

    const pendingOrders = await Order.countDocuments({
      status: "Pending",
    });

    const processingOrders = await Order.countDocuments({
      status: "Processing",
    });

    const shippedOrders = await Order.countDocuments({
      status: "Shipped",
    });

    const deliveredOrders = await Order.countDocuments({
      status: "Delivered",
    });

    const cancelledOrders = await Order.countDocuments({
      status: "Cancelled",
    });

    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      totalProducts,
      totalOrders,
      totalCustomers,
      totalSales,

      orderStatus: {
        pending: pendingOrders,
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
      },

      recentOrders,
    });
  } catch (error) {
    console.error("Admin stats error:", error);

    res.status(500).json({
      message: "Failed to load dashboard stats",
      error: error.message,
    });
  }
};

// =========================
// GET CHAT MESSAGES
// =========================

const getChatMessages = async (req, res) => {
  try {
    const messages = await Chat.find()
      .populate("user", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Get chat messages error:", error);

    res.status(500).json({
      message: "Failed to load chat messages",
      error: error.message,
    });
  }
};

// =========================
// SEND ADMIN MESSAGE
// =========================

const sendAdminMessage = async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message || !message.trim()) {
      return res.status(400).json({
        message: "User ID and message are required",
      });
    }

    const newMessage = await Chat.create({
      user: userId,
      sender: "admin",
      message: message.trim(),
    });

    const populatedMessage = await newMessage.populate(
      "user",
      "name email"
    );

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Send admin message error:", error);

    res.status(500).json({
      message: "Failed to send message",
      error: error.message,
    });
  }
};

// =========================
// EXPORTS
// =========================

module.exports = {
  adminLogin,
  getAdminStats,
  getChatMessages,
  sendAdminMessage,
};