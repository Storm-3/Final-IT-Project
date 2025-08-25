const {DataTypes, Model} = require ('sequelize');
const sequelize = require('../config/database');

class Message extends Model {}

Message.init( {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'id'
        }
    },
    report_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Report',
            key: 'id'
        },
    },
    recepient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'id'
        }
    },
    sent_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
},
{
    sequelize,
modelName: 'Message',
});  

class TextMessage extends Message {}

TextMessage.init({
    text_content_path: DataTypes.STRING,
},
{sequelize,
    modelName: 'TextMessage',
});

class VoiceMessage extends Message {}

VoiceMessage.init({
    voice_content_path: DataTypes.STRING,},
    {
    sequelize,
    modelName: 'VoiceMessage',
    });
    
    class ImageMessage extends Message {}

ImageMessage.init({
    image_content_path: DataTypes.STRING,},
    {
        sequelize,
        modelName: 'ImageMessage',
    });

    module.exports = {
    Message,
    TextMessage,
    VoiceMessage,
    ImageMessage
};
Message.sync({ alter: true }) // Uncomment to sync the model with the database
TextMessage.sync({ alter: true }) // Uncomment to sync the model with the database
VoiceMessage.sync({ alter: true }) // Uncomment to sync the model with the database
ImageMessage.sync({ alter: true }) // Uncomment to sync the model with the database