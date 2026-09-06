const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  getChatMessages,
  sendMessage,
} = require("../controllers/chatController");

const router = express.Router();

// ======================================
// CUSTOMER CHAT
// ======================================

// Get customer's messages
router.get(
  "/",
  protect,
  getChatMessages
);

// Send customer's message
router.post(
  "/",
  protect,
  sendMessage
);

module.exports = router;