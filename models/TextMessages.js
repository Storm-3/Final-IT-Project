const { DataTypes, Model } = require('sequelize');
class TextMessages extends Model {
    static associate(models) {
        // Message o-> Text Message
        TextMessages.belongsTo(models.Messages, {
            foreignKey: 'message_id',
            onDelete: 'CASCADE'
        });
    }

    static initModel(sequelize) {
        TextMessages.init({
            text_content: DataTypes.STRING
        }, {
            sequelize,
            modelName: 'TextMessages',
            tableName: 'TextMessages',
            timestamps: true,
            paranoid: true
        });
    }
}

module.exports = TextMessages;