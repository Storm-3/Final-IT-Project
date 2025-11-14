const streamService = require("../service/streamService"); 
const db = require("../models");

// Start a chat between two users
exports.startChat = async (req, res) => {
  try {
    const { userId, otherUserId, reportId } = req.body;

    // Fetch users and report
    const user1 = await db.Users.findByPk(userId);
    const user2 = await db.Users.findByPk(otherUserId);
    const report = await db.Reports.findByPk(reportId);

    if (!user1 || !user2 || !report) {
      return res.status(404).json({ error: "User or report not found" });
    }

    // Provision Stream users (creates if doesn't exist)
    const streamId1 = await streamService.provisionStreamUser(user1);
    const streamId2 = await streamService.provisionStreamUser(user2);

    // Get session token for the initiating user
    const sessionToken = await streamService.getStreamSessionToken(
      streamId1
    );

    // Create channel
    const channel = await streamService.createChannel(
      [streamId1, streamId2],
      "Report Chat",
      report.id
    );

    // Stream returns 'id' for the channel ID
    res.status(200).json({
      channelId: channel.id, // <-- FIXED: Use channel.id
      sessionToken,
      streamId: streamId1,
      streamApiKey: process.env.STREAM_API_KEY, // Send API key to client
    });
  } catch (err) {
    console.error("startChat error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Issue a session token for authenticated user
exports.issueChatToken = async (req, res) => {
  try {
    const user = await db.Users.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Provision user and get their Stream ID
    const streamId = await streamService.provisionStreamUser(user);
    // Create a new token
    const token = await streamService.getStreamSessionToken(streamId);

    res.json({ 
      token,
      streamId: streamId,
      streamApiKey: process.env.STREAM_API_KEY // Send API key to client
    });
  } catch (err) {
    console.error("issueChatToken error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Send a message to a channel
exports.sendMessage = async (req, res) => {
  try {
    // Note: channelId is used instead of channelUrl
    const { channelId, messageText } = req.body;
    
    // Get user from DB
    const user = await db.Users.findByPk(req.user.id);

    // Check for the 'stream_id' column
    if (!user || !user.stream_id) {
      return res.status(400).json({ error: "User not provisioned for chat" });
    }

    const streamId = user.stream_id; // Use correct DB field

    // The new service doesn't need the user's session token to send
    // a message from the backend.
    const message = await streamService.sendMessage(
      channelId,
      messageText,
      streamId
    );

    res.status(200).json({ message });
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ error: err.message });
  }
};