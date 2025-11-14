const { StreamChat } = require('stream-chat');

// Load from .env
const STREAM_API_KEY = process.env.STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_API_SECRET;

// Initialize the Stream client (this is a server-side client)
const client = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);

module.exports = client;