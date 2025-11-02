const { DataTypes, Model } = require("sequelize");

class ImageMessages extends Model {
  static associate(models) {
    ImageMessages.belongsTo(models.Messages, { foreignKey: "message_id" });
  }

  static initModel(sequelize) {
    ImageMessages.init(
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        message_id: { type: DataTypes.INTEGER, allowNull: false },
        file_url: { type: DataTypes.STRING, allowNull: false },
      },
      {
        sequelize,
        modelName: "ImageMessages",
        tableName: "ImageMessages",
        timestamps: true,
        paranoid: true,
      }
    );
  }
}

module.exports = ImageMessages;
