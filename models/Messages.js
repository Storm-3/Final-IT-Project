const { DataTypes, Model } = require("sequelize");

class Messages extends Model {
  static associate(models) {
    // Link sender and recipient
    Messages.belongsTo(models.Users, { foreignKey: "sender_id", as: "sender" });
    Messages.belongsTo(models.Users, {
      foreignKey: "recipient_id",
      as: "recipient",
    });

    // Link attachments
    Messages.hasMany(models.TextMessages, { foreignKey: "message_id" });
    Messages.hasMany(models.VoiceMessages, { foreignKey: "message_id" });
    Messages.hasMany(models.ImageMessages, { foreignKey: "message_id" });
  }

  static initModel(sequelize) {
    Messages.init(
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        sender_id: { type: DataTypes.INTEGER, allowNull: false },
        recipient_id: { type: DataTypes.INTEGER, allowNull: false },
        report_id: { type: DataTypes.INTEGER, allowNull: false },
        message_type: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: { isIn: [["text", "image", "voice"]] },
        },
        sent_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        modelName: "Messages",
        tableName: "Messages",
        timestamps: true,
        paranoid: true,
      }
    );
  }
}

module.exports = Messages;
