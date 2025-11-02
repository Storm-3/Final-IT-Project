const { DataTypes, Model } = require("sequelize");

class VoiceMessages extends Model {
  static associate(models) {
    VoiceMessages.belongsTo(models.Messages, { foreignKey: "message_id" });
  }

  static initModel(sequelize) {
    VoiceMessages.init(
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        message_id: { type: DataTypes.INTEGER, allowNull: false },
        file_url: { type: DataTypes.STRING, allowNull: false },
      },
      {
        sequelize,
        modelName: "VoiceMessages",
        tableName: "VoiceMessages",
        timestamps: true,
        paranoid: true,
      }
    );
  }
}

module.exports = VoiceMessages;
