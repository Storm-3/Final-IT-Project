const { Model, DataTypes } = require('sequelize');

class IncidentTypes extends Model {
  static associate(models) {
    IncidentTypes.hasMany(models.Reports, { foreignKey: 'incident_type_id' });
  }

  static initModel(sequelize) {
    IncidentTypes.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      description: DataTypes.TEXT
    }, {
      sequelize,
      modelName: 'IncidentTypes',
      tableName: 'IncidentTypes',
      timestamps: false
    });
  }
}

module.exports = IncidentTypes;
