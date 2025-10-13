const db = require('../models');
const Messages = db.Messages;
const { Op } = require('sequelize');


exports.CreateMessage = async (req, res) => {
  try {
    const { sender_id, receiver_id, content } = req.body;
    const message = await Messages.create({ sender_id, receiver_id, content });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create message', details: err.message });
  }
};

exports.GetAllMessages = async (req, res) => {
  try {
    const messages = await Messages.findAll({
      where: {
        [Op.or]: [
          { sender_id: req.user.id },
          { receiver_id: req.user.id }
        ]
      }
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages', details: err.message });
  }
};


exports.GetMessageById = async (req, res) => {
  try {
    const message = await Messages.findByPk(req.params.id);
    if (!message) return res.status(404).json({ error: 'Message not found' });
    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch message', details: err.message });
  }
};

exports.UpdateMessageById = async (req, res) => {
  try {
    const message = await Messages.findByPk(req.params.id);
    if (!message) return res.status(404).json({ error: 'Message not found' });

    await message.update(req.body);
    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update message', details: err.message });
  }
};

exports.DeleteMessageById = async (req, res) => {
  try {
    const message = await Messages.findByPk(req.params.id);
    if (!message) return res.status(404).json({ error: 'Message not found' });

    await message.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete message', details: err.message });
  }
};

exports.GetConversationWithUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const myId = req.user.id;

    const { count, rows } = await Messages.findAndCountAll({
      where: {
        [Op.or]: [
          { sender_id: myId, receiver_id: userId },
          { sender_id: userId, receiver_id: myId }
        ]
      },
      order: [['createdAt', 'ASC']],
      limit: req.query.limit ? parseInt(req.query.limit) : 10, // Default limit to 10
      offset: req.query.page ? (parseInt(req.query.page) - 1) * (req.query.limit || 10) : 0
    });

    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    res.status(200).json({
      totalMessages: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      messages: rows
    });
    
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch conversation', details: err.message });
  }
};



