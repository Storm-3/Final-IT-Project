'use strict';

const { DataTypes, Model } = require('sequelize');

class Articles extends Model {
  static associate(models) {
    Articles.belongsTo(models.Users, { foreignKey: 'user_id' });
  }

  static initModel(sequelize) {
    Articles.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'Articles',
      tableName: 'Articles',
      timestamps: true,

      // Validation logic
      validate: {
        async counsellorOnly() {
          const user = await sequelize.models.Users.findByPk(this.user_id);
          if (!user || user.role_id !== 2) {
            throw new Error('Only counsellors can create articles.');
          }
        },

        titleLength() {
          if (this.title && this.title.length < 10) {
            throw new Error('Article title must be at least 10 characters long.');
          }
        },

        contentLength() {
          if (this.content && this.content.length < 50) {
            throw new Error('Article content must be at least 50 characters long.');
          }
        }
      }
    });
  }
}

module.exports = Articles;
