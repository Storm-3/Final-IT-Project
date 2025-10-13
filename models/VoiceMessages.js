const { DataTypes, Model } = require('sequelize');

class VoiceMessages extends Model {
    static associate(models) {
        // Message o-> Voice Message
        VoiceMessages.belongsTo(models.Messages, {
            foreignKey: 'message_id',
            onDelete: 'CASCADE'
        });
    }

    static initModel(sequelize) {
        VoiceMessages.init({
            voice_content: DataTypes.STRING
        }, {
            sequelize,
            modelName: 'VoiceMessages',
            tableName: 'VoiceMessages',
            timestamps: true,
            paranoid: true
        });
    }
}

module.exports = VoiceMessages;