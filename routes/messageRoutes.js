const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const authToken = require("../controllers/middleware/authToken");

// All routes below require authentication
router.post("/", authToken, messageController.CreateMessage);
router.get("/", authToken, messageController.GetAllMessages); // GET /api/messages
router.get("/:id", authToken, messageController.GetMessageById); // GET /api/messages/:id
router.get("/user/:id", authToken, messageController.GetConversationWithUser);
router.put("/:id", authToken, messageController.UpdateMessageById); // PUT /api/messages/:id
router.delete("/:id", authToken, messageController.DeleteMessageById); // DELETE /api/messages/:id

module.exports = router;
