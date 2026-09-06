const Chat = require("../models/Chat");

// ======================================
// GET CUSTOMER CHAT MESSAGES
// ======================================

const getChatMessages = async (req, res) => {
  try {
    const userId = req.user._id;

    const messages = await Chat.find({
      user: userId,
    })
      .populate("user", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error(
      "Get chat messages error:",
      error
    );

    res.status(500).json({
      message: "Failed to load chat messages",
      error: error.message,
    });
  }
};

// ======================================
// CUSTOMER SEND MESSAGE
// ======================================

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const newMessage = await Chat.create({
      user: req.user._id,
      sender: "user",
      message: message.trim(),
    });

    const populatedMessage =
      await newMessage.populate(
        "user",
        "name email"
      );

    res.status(201).json(
      populatedMessage
    );
  } catch (error) {
    console.error(
      "Send chat message error:",
      error
    );

    res.status(500).json({
      message: "Failed to send message",
      error: error.message,
    });
  }
};

module.exports = {
  getChatMessages,
  sendMessage,
};