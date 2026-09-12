const express = require("express");

const {
  adminLogin,
  getAdminStats,
  getChatMessages,
  sendAdminMessage,
} = require("../controllers/adminController");

const adminProtect = require("../middleware/adminMiddleware");

const router = express.Router();

// ADMIN BASE TEST ROUTE
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin API is working",
  });
});

// ADMIN LOGIN
router.post("/login", adminLogin);

// ADMIN DASHBOARD STATS
router.get(
  "/stats",
  adminProtect,
  getAdminStats
);

// ADMIN CHAT MESSAGES
router.get(
  "/chat",
  adminProtect,
  getChatMessages
);

// ADMIN SEND MESSAGE
router.post(
  "/chat",
  adminProtect,
  sendAdminMessage
);

module.exports = router;