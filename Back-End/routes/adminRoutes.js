const express = require("express");

const {
  adminLogin,
  getAdminStats,
  getChatMessages,
  sendAdminMessage,
} = require("../controllers/adminController");

const adminProtect = require("../middleware/adminMiddleware");

const router = express.Router();

// =========================
// ADMIN LOGIN
// =========================

router.post("/login", adminLogin);

// =========================
// ADMIN DASHBOARD
// =========================

// Get dashboard statistics
router.get(
  "/stats",
  adminProtect,
  getAdminStats
);

// =========================
// ADMIN CHAT
// =========================

// Get chat messages
router.get(
  "/chat",
  adminProtect,
  getChatMessages
);

// Send admin message
router.post(
  "/chat",
  adminProtect,
  sendAdminMessage
);

module.exports = router;