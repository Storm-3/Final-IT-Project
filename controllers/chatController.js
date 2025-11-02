const sendbirdService = require("../service/sendbirdService");
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

    // Provision SendBird users (creates if doesn't exist)
    const sendbirdId1 = await sendbirdService.provisionSendBirdUser(user1);
    const sendbirdId2 = await sendbirdService.provisionSendBirdUser(user2);

    // Get session token for the initiating user
    const sessionToken = await sendbirdService.getSendbirdSessionToken(
      sendbirdId1
    );

    // Create channel via REST API
    const channel = await sendbirdService.createChannel(
      [sendbirdId1, sendbirdId2],
      "Report Chat",
      report.id,
      [sendbirdId1, sendbirdId2]
    );

    // SendBird REST API returns `channel_url`, not `url`
    res.status(200).json({
      channelUrl: channel.channel_url, // FIXED: Use channel_url
      sessionToken,
      sendbirdId: sendbirdId1,
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

    const sendbirdId = await sendbirdService.provisionSendBirdUser(user);
    const token = await sendbirdService.getSendbirdSessionToken(sendbirdId);

    res.json({ token });
  } catch (err) {
    console.error("issueChatToken error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Send a message to a channel
exports.sendMessage = async (req, res) => {
  try {
    const { channelUrl, messageText, sendbirdToken } = req.body;
    const token = sendbirdToken || req.user?.sendbirdToken;

    if (!token) {
      return res.status(401).json({ error: "Missing SendBird token" });
    }

    // Get user from DB
    const user = await db.Users.findByPk(req.user.id);
    if (!user || !user.sendbird_id) {
      return res.status(400).json({ error: "User not provisioned for chat" });
    }

    const sendbirdId = user.sendbird_id; // Use correct DB field

    const message = await sendbirdService.sendMessage(
      channelUrl,
      messageText,
      sendbirdId,
      token
    );

    res.status(200).json({ message });
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ error: err.message });
  }
};
