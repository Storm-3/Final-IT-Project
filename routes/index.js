const express = require('express');
const sequelize = require('../../config/database'); 

// Import models
const User = require('../User');
const ResourceDirectory = require('../ResourceDirectory');
const Report = require('../Report');
const {Message, TextMessage, VoiceMessage, ImageMessage} = require('../Message');

const app = express();
app.use(express.json());

// User ↔ ResourceDirectory
User.belongsTo(ResourceDirectory, { foreignKey: 'resource_id' });
ResourceDirectory.hasMany(User, { foreignKey: 'resource_id' });

// Report ↔ User
Report.belongsTo(User, { foreignKey: 'user_id' });
Report.belongsTo(User, { foreignKey: 'assigned_counsellor_id' });

// Message ↔ User
Message.belongsTo(User, { foreignKey: 'sender_id' });
Message.belongsTo(User, { foreignKey: 'recepient_id' });

// Message ↔ Report
Message.belongsTo(Report, { foreignKey: 'report_id' });

// Message ↔ Text/Voice/Image Messages
Message.hasMany(TextMessage, { foreignKey: 'message_id' });
Message.hasMany(VoiceMessage, { foreignKey: 'message_id' });
Message.hasMany(ImageMessage, { foreignKey: 'message_id' });

TextMessage.belongsTo(Message, { foreignKey: 'message_id' });
VoiceMessage.belongsTo(Message, { foreignKey: 'message_id' });
ImageMessage.belongsTo(Message, { foreignKey: 'message_id' });

sequelize.sync({ force: false }) //??? Set to true to drop tables and recreate them
  .then(() => {
    console.log('Database and tables created successfully.');
  })
  .catch(er => console.error('Error syncing database:', er));

//start the server
app.listen(3000, () => {    
  console.log('Server is running on port 3000');
});
