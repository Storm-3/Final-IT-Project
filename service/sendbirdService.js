const fetch = require("node-fetch");

async function getSendBirdUserId(user) {
  const role = await require("../models").UserRoles.findByPk(user.role_id);
  if (!role) throw new Error(`Role not found for role_id: ${user.role_id}`);
  return `${role.role_name}_${user.id}`;
}

async function checkSendBirdUserExists(userId) {
  const response = await fetch(
    `https://api-${process.env.SENDBIRD_APP_ID}.sendbird.com/v3/users/${userId}`,
    {
      method: "GET",
      headers: { "Api-Token": process.env.SENDBIRD_API_TOKEN },
    }
  );
  return response.ok;
}

async function createSendBirdUser(userId, nickname) {
  const safeNickname = nickname || "Guest";
  const profileUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    safeNickname
  )}`;
  const payload = {
    user_id: userId,
    nickname: safeNickname,
    profile_url: profileUrl,
  };

  const response = await fetch(
    `https://api-${process.env.SENDBIRD_APP_ID}.sendbird.com/v3/users`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Token": process.env.SENDBIRD_API_TOKEN,
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();
  if (!response.ok)
    throw new Error(data.message || "Failed to create SendBird user");
  return data;
}

async function provisionSendBirdUser(user) {
  const sendbirdId = await getSendBirdUserId(user);
  const exists = await checkSendBirdUserExists(sendbirdId);

  if (!exists) {
    await createSendBirdUser(sendbirdId, user.name);
  }

  await user.update({ sendbird_id: sendbirdId }); // ← FIXED
  return sendbirdId;
}

async function getSendbirdSessionToken(userId) {
  const response = await fetch(
    `https://api-${process.env.SENDBIRD_APP_ID}.sendbird.com/v3/users/${userId}/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Token": process.env.SENDBIRD_API_TOKEN,
      },
      body: JSON.stringify({}),
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to get token");
  return data.token;
}

async function createChannel(userIds, name, reportId) {
  const response = await fetch(
    `https://api-${process.env.SENDBIRD_APP_ID}.sendbird.com/v3/group_channels`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Token": process.env.SENDBIRD_API_TOKEN,
      },
      body: JSON.stringify({
        user_ids: userIds,
        name: `${name} - Report #${reportId}`,
        data: JSON.stringify({ report_id: reportId }),
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to create channel");
  return data;
}

async function sendMessage(channelUrl, messageText, sendbirdId, sessionToken) {
  const response = await fetch(
    `https://api-${process.env.SENDBIRD_APP_ID}.sendbird.com/v3/group_channels/${channelUrl}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Token": process.env.SENDBIRD_API_TOKEN,
        "Session-Key": sessionToken,
      },
      body: JSON.stringify({
        message_type: "MESG",
        user_id: sendbirdId,
        message: messageText,
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to send message");
  return data;
}

module.exports = {
  createChannel,
  sendMessage,
  provisionSendBirdUser,
  getSendbirdSessionToken,
};
