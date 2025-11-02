const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const authToken = require("../controllers/middleware/authToken");

// Start a chat
router.post("/start", authToken, chatController.startChat);

// Issue a SendBird token
router.post("/token", authToken, chatController.issueChatToken);

// Send a message
router.post("/message", authToken, chatController.sendMessage);

module.exports = router;
