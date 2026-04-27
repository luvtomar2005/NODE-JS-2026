const socket = require("socket.io");
const Message = require("../models/message");
const mongoose = require("mongoose");

const initializeSocket = (server) => {
  const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const io = socket(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected, socket ID:", socket.id);

    socket.on("joinChat", async ({ chatId, userId }) => {
      if (!chatId || !userId) {
        return socket.emit("chatError", {
          message: "chatId and userId are required to join chat",
        });
      }

      try {
        socket.join(chatId);
        console.log(`User ${userId} joined socket room: ${chatId}`);

        // Bonus: return last 50 chat messages for this room.
        const latestMessages = await Message.find({ chatId })
          .sort({ createdAt: -1 })
          .limit(50)
          .lean();

        socket.emit("chatHistory", {
          chatId,
          messages: latestMessages.reverse(),
        });
      } catch (error) {
        console.error("Failed to join chat room:", error);
        socket.emit("chatError", {
          message: "Unable to join chat room",
        });
      }
    });

    socket.on("sendMessage", async ({ chatId, senderId, text, type, tag, replyTo }) => {
      try {
        const safeText = typeof text === "string" ? text.trim() : "";
        if (!chatId || !senderId || !safeText) {
          return socket.emit("chatError", {
            message: "chatId, senderId, and text are required to send a message",
          });
        }
        if (!mongoose.Types.ObjectId.isValid(senderId)) {
          return socket.emit("chatError", {
            message: "senderId must be a valid ObjectId",
          });
        }

        const safeType = type === "code" ? "code" : "text";
        const safeTag =
          tag === "Help" || tag === "Discussion" || tag === "Idea" ? tag : null;
        const safeReplyTo =
          replyTo && mongoose.Types.ObjectId.isValid(replyTo) ? replyTo : null;

        const message = new Message({
          chatId,
          senderId,
          text: safeText,
          type: safeType,
          tag: safeTag,
          replyTo: safeReplyTo,
        });

        await message.save();

        io.to(chatId).emit("messageReceived", {
          _id: message._id,
          chatId: message.chatId,
          senderId: message.senderId,
          text: message.text,
          type: message.type,
          tag: message.tag,
          replyTo: message.replyTo,
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
        });
      } catch (error) {
        console.error("Error saving/sending message:", error);
        socket.emit("chatError", { message: "Failed to send message" });
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("User disconnected, socket ID:", socket.id, "reason:", reason);
    });
  });
};

module.exports = initializeSocket;