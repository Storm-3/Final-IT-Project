const { DataTypes, Model } = require('sequelize');

class Messages extends Model {
    static associate(models) {
        // Message <-o User
        Messages.belongsTo(models.Users, {
            foreignKey: 'sender_id',
            onDelete: 'CASCADE' // making sure every message related to user is (soft) deleted
        });
        Messages.belongsTo(models.Users, {
            foreignKey: 'recipient_id',
            as: 'sentMessages',
            onDelete: 'CASCADE' // making sure every message related to user is (soft) deleted
        });

        // Message <-o Report
        Messages.belongsTo(models.Reports, {
            foreignKey: 'report_id',
            as: 'receivedMessages',
            onDelete: 'CASCADE'
        });

        // Message o-> Text/Voice/Image Messages
        Messages.hasMany(models.TextMessages, { foreignKey: 'message_id' });
        Messages.hasMany(models.VoiceMessages, { foreignKey: 'message_id' });
        Messages.hasMany(models.ImageMessages, { foreignKey: 'message_id' });
    }

    static initModel(sequelize) {
        Messages.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            sender_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                // references: { model: 'Users', key: 'id' }
            },
            report_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                // references: { model: 'Reports', key: 'id' }
            },
            recipient_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                // references: { model: 'Users', key: 'id' }
            },
            sent_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            message_type: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: [['text', 'image', 'voice']]
                }
            }
        }, {
            sequelize,
            modelName: 'Messages',
            tableName: 'Messages',
            timestamps: true,
            paranoid: true
        });
    }
}

    module.exports = Messages;
