const { DataTypes, Model } = require('sequelize');

class ImageMessages extends Model {
    static associate(models) {
        // Message o-> Image Message
        ImageMessages.belongsTo(models.Messages, {
            foreignKey: 'message_id',
            onDelete: 'CASCADE'
        });
    }

    static initModel(sequelize) {
        ImageMessages.init({
            image_path: DataTypes.STRING
        }, {
            sequelize,
            modelName: 'ImageMessages',
            tableName: 'ImageMessages',
            timestamps: true,
            paranoid: true
        });
    }
}
module.exports = ImageMessages;