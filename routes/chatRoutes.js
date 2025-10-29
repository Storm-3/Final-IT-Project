const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authToken = require('../controllers/middleware/authToken');

router.post('/start-chat', chatController.startChat);
router.post('/send-message', chatController.sendMessage);
router.get('/token', authToken, chatController.issueChatToken);
module.exports = router;
