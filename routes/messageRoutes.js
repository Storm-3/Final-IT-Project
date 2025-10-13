const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authToken = require('../controllers/middleware/authToken');

// All routes below require authentication
router.post('/', messageController.CreateMessage);
//router.get('/', messageController.GetAllMessages);
router.get('/messages', authToken, messageController.GetAllMessages);
router.get('/:id', messageController.GetMessageById);
router.get('/user:id', messageController.GetConversationWithUser);
router.put('/:id', messageController.UpdateMessageById);
router.delete('/:id', messageController.DeleteMessageById);

module.exports = router;
