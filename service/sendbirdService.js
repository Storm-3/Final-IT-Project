const sb = require('../config/sendbirdClient');
const db = require('../models');
const fetch = require('node-fetch');

// 🔍 Resolve role name from role_id
async function getSendBirdUserId(user) {
  const role = await db.UserRoles.findByPk(user.role_id);
  if (!role) throw new Error(`Role not found for role_id: ${user.role_id}`);
  return `${role.role_name}_${user.id}`;
}

// 🔍 Check if user already exists in SendBird
async function checkSendBirdUserExists(userId) {
  const response = await fetch(`https://api-${process.env.SENDBIRD_APP_ID}.sendbird.com/v3/users/${userId}`, {
    method: 'GET',
    headers: {
      'Api-Token': process.env.SENDBIRD_API_TOKEN
    }
  });
  return response.ok;
}

// 🛠️ Create user in SendBird via REST API
async function createSendBirdUser(userId, nickname) {
  const safeNickname = nickname || 'Guest';
  const profileUrl = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(safeNickname);

  const payload = {
    user_id: userId,
    nickname: safeNickname,
    profile_url: profileUrl
  };

  console.log('Creating SendBird user with payload:', payload);

  const response = await fetch(`https://api-${process.env.SENDBIRD_APP_ID}.sendbird.com/v3/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Token': process.env.SENDBIRD_API_TOKEN
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok || !data.user_id) {
    console.error('SendBird user creation failed:', data);
    throw new Error(data.message || 'SendBird user creation failed');
  }

  return data;
}

// 🔄 Provision user: resolve ID, create in SendBird if needed, update DB
async function provisionSendBirdUser(user) {
  const sendbirdId = await getSendBirdUserId(user);
  const exists = await checkSendBirdUserExists(sendbirdId);

  if (!exists) {
    await createSendBirdUser(sendbirdId, user.name);
  }

  await user.update({ sendbird_user_id: sendbirdId });
  return sendbirdId;
}

// 🔑 Get SendBird session token
async function getSendbirdSessionToken(userId) {
  const url = `https://api-${process.env.SENDBIRD_APP_ID}.sendbird.com/v3/users/${userId}/token`;

  console.log('Requesting SendBird session token for:', userId);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Token': process.env.SENDBIRD_API_TOKEN
    },
    body: JSON.stringify({}) // SendBird requires a valid JSON body, even if empty
  });

  const data = await response.json();
  if (!response.ok || !data.token) {
    console.error('SendBird token error:', data);
    throw new Error(data.message || 'Failed to issue SendBird session token');
  }

  return data.token;
}

// 💬 Create chat channel with metadata
function createChannel(userIds, name, reportId, participantIds) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return reject(new Error('Invalid userIds array'));
    }
    if (typeof name !== 'string' || !name.trim()) {
      return reject(new Error('Channel name must be a non-empty string'));
    }
    if (!reportId) {
      return reject(new Error('Missing reportId'));
    }

    const params = new sb.GroupChannelParams();
    params.addUserIds(userIds);
    params.name = name.trim();
    params.data = JSON.stringify({
      report_id: reportId,
      participants: participantIds || []
    });

    console.log('Creating SendBird channel with params:', params);

    sb.GroupChannel.createChannel(params, (channel, error) => {
      if (error) {
        console.error('SendBird channel creation failed:', error);
        return reject(error);
      }
      resolve(channel);
    });
  });
}

// 📨 Send a message to a channel using session token
function sendMessage(channelUrl, messageText, token) {
  return new Promise((resolve, reject) => {
    sb.GroupChannel.getChannel(channelUrl, (channel, error) => {
      if (error) return reject(error);

      const params = new sb.UserMessageParams();
      params.message = messageText;

      console.log('Sending message:', messageText);

      channel.sendUserMessage(params, (message, error) => {
        if (error) {
          console.error('SendBird message error:', error);
          return reject(error);
        }
        resolve(message);
      });
    });
  });
}

// ✅ Export all service methods
module.exports = {
  createChannel,
  sendMessage,
  getSendBirdUserId,
  createSendBirdUser,
  provisionSendBirdUser,
  getSendbirdSessionToken,
  checkSendBirdUserExists
};