const { DataTypes, Model } = require("sequelize");

class ResourceDirectories extends Model {
  static associate(models) {
    // Resource o-> Users
    ResourceDirectories.hasMany(models.Users, { foreignKey: "resource_id" });
  }

  static initModel(sequelize) {
    ResourceDirectories.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        phone_number: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        address: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        website: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "ResourceDirectories",
        tableName: "ResourceDirectories",
        timestamps: true,
        paranoid: true,
      }
    );
  }
}

module.exports = ResourceDirectories;
