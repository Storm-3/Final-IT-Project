console.log("📱--- CHAT ROUTES FILE LOADED ---");

const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const authToken = require("../controllers/middleware/authToken");

// Start a stream chat session
router.post("/start", authToken, chatController.startChat);
router.post("/send", authToken, chatController.sendMessage);

module.exports = router;
