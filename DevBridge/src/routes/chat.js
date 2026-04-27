const express = require("express");
const { userAuth } = require("../middleware/auth");
const Message = require("../models/message");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const userId = req.user._id;

    const chatId = [userId.toString(), targetUserId].sort().join("_");

    const messages = await Message.find({ chatId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json({
      message: "Chat messages fetched successfully",
      chatId,
      data: messages.reverse(),
    });
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = chatRouter;
