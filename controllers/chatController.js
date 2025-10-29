const sendbirdService = require('../service/sendbirdService');
const db = require('../models');

// 🟢 Start a chat between two users
exports.startChat = async (req, res) => {
  try {
    const { userId, otherUserId, reportId } = req.body;

    const user1 = await db.Users.findByPk(userId);
    const user2 = await db.Users.findByPk(otherUserId);
    const report = await db.Reports.findByPk(reportId);

    if (!user1 || !user2 || !report) {
      return res.status(404).json({ error: 'User or report not found' });
    }

    const sendbirdId1 = await sendbirdService.provisionSendBirdUser(user1);
    const sendbirdId2 = await sendbirdService.provisionSendBirdUser(user2);

    const sessionToken = await sendbirdService.getSendbirdSessionToken(sendbirdId1);

    const channel = await sendbirdService.createChannel(
      [sendbirdId1, sendbirdId2],
      'Report Chat',
      report.id,
      [sendbirdId1, sendbirdId2]
    );

    res.status(200).json({
      channelUrl: channel.url,
      sessionToken,
      sendbirdId: sendbirdId1
    });
  } catch (err) {
    console.error('startChat error:', err);
    res.status(500).json({ error: err.message });
  }
};

// 🔑 Issue a session token for authenticated user
exports.issueChatToken = async (req, res) => {
  try {
    const user = await db.Users.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const sendbirdId = await sendbirdService.provisionSendBirdUser(user);
    const token = await sendbirdService.getSendbirdSessionToken(sendbirdId);

    res.json({ token });
  } catch (err) {
    console.error('issueChatToken error:', err);
    res.status(500).json({ error: err.message });
  }
};

// 📨 Send a message to a channel
exports.sendMessage = async (req, res) => {
  try {
    const { channelUrl, messageText } = req.body;
    const token = req.user?.sendbirdToken;

    if (!token) {
      return res.status(401).json({ error: 'Missing Sendbird token' });
    }

    const message = await sendbirdService.sendMessage(channelUrl, messageText, token);
    res.status(200).json({ message });
  } catch (err) {
    console.error('sendMessage error:', err);
    res.status(500).json({ error: err.message });
  }
};