const db = require("../models");
const Messages = db.Messages;
const TextMessages = db.TextMessages;
const VoiceMessages = db.VoiceMessages;
const ImageMessages = db.ImageMessages;
const Users = db.Users;

const { Op } = require("sequelize");

exports.CreateMessage = async (req, res) => {
  try {
    const { sender_id, recipient_id, report_id, message_type } = req.body;

    if (!sender_id || !recipient_id || !report_id || !message_type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const message = await Messages.create({
      sender_id,
      recipient_id,
      report_id,
      message_type,
    });

    res.status(201).json(message);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create message", details: err.message });
  }
};

exports.GetAllMessages = async (req, res) => {
  try {
    const userId = req.user.id;

    const messages = await Messages.findAll({
      where: {
        [Op.or]: [{ sender_id: userId }, { recipient_id: userId }],
      },
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json(messages);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch messages", details: err.message });
  }
};

exports.GetMessageById = async (req, res) => {
  try {
    const message = await Messages.findByPk(req.params.id);
    if (!message) return res.status(404).json({ error: "Message not found" });
    res.status(200).json(message);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch message", details: err.message });
  }
};

exports.UpdateMessageById = async (req, res) => {
  try {
    const message = await Messages.findByPk(req.params.id);
    if (!message) return res.status(404).json({ error: "Message not found" });

    await message.update(req.body);
    res.status(200).json(message);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update message", details: err.message });
  }
};

exports.DeleteMessageById = async (req, res) => {
  try {
    const message = await Messages.findByPk(req.params.id);
    if (!message) return res.status(404).json({ error: "Message not found" });

    await message.destroy();
    res.status(204).send();
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete message", details: err.message });
  }
};

exports.GetConversationWithUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const myId = req.user?.id; // ✅ Get current user's ID

    if (!myId) return res.status(401).json({ error: "Unauthorized" });
    if (!userId) return res.status(400).json({ error: "User ID is required" });

    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;

    const { count, rows } = await Messages.findAndCountAll({
      where: {
        [Op.or]: [
          { sender_id: myId, recipient_id: userId },
          { sender_id: userId, recipient_id: myId },
        ],
      },
      order: [["createdAt", "ASC"]],
      limit,
      offset: (page - 1) * limit,
    });

    res.status(200).json({
      totalMessages: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      messages: rows,
    });
  } catch (err) {
    console.error("Failed to fetch conversation:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch conversation", details: err.message });
  }
};
