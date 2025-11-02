const { DataTypes, Model } = require("sequelize");

class TextMessages extends Model {
  static associate(models) {
    TextMessages.belongsTo(models.Messages, { foreignKey: "message_id" });
  }

  static initModel(sequelize) {
    TextMessages.init(
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        message_id: { type: DataTypes.INTEGER, allowNull: false },
        content: { type: DataTypes.TEXT, allowNull: false },
      },
      {
        sequelize,
        modelName: "TextMessages",
        tableName: "TextMessages",
        timestamps: true,
        paranoid: true,
      }
    );
  }
}

module.exports = TextMessages;
