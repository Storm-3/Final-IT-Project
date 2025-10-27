const { DataTypes, Model } = require('sequelize');

class UserRoles extends Model {
  static associate(models) {
    // User to UserRoles
    UserRoles.hasMany(models.Users, { foreignKey: 'role_id' });
  }

  static initModel(sequelize) {
    UserRoles.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      role_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['survivor', 'counsellor', 'admin']] // id: 1 - survivor, 2 - counsellor, 3 - admin
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, {
      sequelize,
      modelName: 'UserRoles',
      tableName: 'UserRoles',
      timestamps:false,
    });
  }
}

module.exports = UserRoles;

