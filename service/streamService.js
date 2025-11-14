const client = require("../config/streamClient"); // Import the new Stream client

/**
 * Creates a unique Stream user ID from the local user object.
 * (This logic is the same as before, just renamed)
 */
async function getStreamUserId(user) {
  const role = await require("../models").UserRoles.findByPk(user.role_id);
  if (!role) throw new Error(`Role not found for role_id: ${user.role_id}`);
  return `${role.role_name}_${user.id}`;
}

/**
 * Creates or updates a user in Stream.
 * Stream's 'upsertUser' handles both creation and updates in one go.
 */
async function createStreamUser(userId, nickname, roleName) {
  const safeNickname = nickname || "Guest";
  const userToUpsert = {
    id: userId,
    name: safeNickname,
    role: roleName,
    // Generates the same type of avatar URL
    image: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      safeNickname
    )}`,
  };

  try {
    const response = await client.upsertUser(userToUpsert);
    return response.users[userId];
  } catch (err) {
    console.error("Failed to create/update Stream user:", err);
    throw new Error(err.message || "Failed to create Stream user");
  }
}

/**
 * Ensures a user exists in Stream and updates their local DB record.
 */
async function provisionStreamUser(user) {
  const streamId = await getStreamUserId(user);

  // Get role name to pass to Stream
  const role = await require("../models").UserRoles.findByPk(user.role_id);
  const roleName = role ? role.role_name : "user";

  // 'upsertUser' will create the user if they don't exist
  // or update them if they do.
  await createStreamUser(streamId, user.name, roleName);

  // Update the local user record with the Stream ID
  // Make sure your Users model has a 'stream_id' column!
  await user.update({ stream_id: streamId });
  return streamId;
}

/**
 * Generates a session token for a client (e.g., your Android app).
 */
async function getStreamSessionToken(userId) {
  try {
    // This is much simpler in Stream
    const token = client.createToken(userId);
    return token;
  } catch (err) {
    console.error("Failed to get Stream token:", err);
    throw new Error(err.message || "Failed to get token");
  }
}

/**
 * Creates a new 'messaging' channel.
 */
async function createChannel(userIds, name, reportId) {
  try {
    const channelName = `${name} - Report #${reportId}`;
    
    // We use 'messaging' type for typical 1-on-1 or group chats
    // We can add custom data like 'report_id' directly
    const channel = client.channel("messaging", {
      name: channelName,
      members: userIds,
      created_by_id: userIds[0], // Set the creator
      report_id: reportId, // Custom data
    });

    // Create the channel
    await channel.create();
    return channel; // Return the full channel object
  } catch (err) {
    console.error("Failed to create Stream channel:", err);
    throw new Error(err.message || "Failed to create channel");
  }
}

/**
 * Sends a message to a channel from the backend.
 * NOTE: The backend client (using API Secret) can send a message
 * 'as' any user by specifying the user_id in the message object.
 */
async function sendMessage(channelId, messageText, streamId) {
  try {
    const channel = client.channel("messaging", channelId);

    const message = {
      text: messageText,
      user_id: streamId, // Send the message *as* this user
    };

    const response = await channel.sendMessage(message);
    return response.message;
  } catch (err) {
    console.error("Failed to send Stream message:", err);
    throw new Error(err.message || "Failed to send message");
  }
}

module.exports = {
  createChannel,
  sendMessage,
  provisionStreamUser,
  getStreamSessionToken,
};