const SendBird = require('sendbird');
const sb = new SendBird({ appId: process.env.SENDBIRD_APP_ID});

module.exports = sb;