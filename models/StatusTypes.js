const { Model, DataTypes } = require('sequelize');

class StatusTypes extends Model {
    static associate(models) {
        // StatusType <-o Report
        StatusTypes.hasMany(models.Reports, { foreignKey: 'status_id' });
    }

    static initModel(sequelize) {
        StatusTypes.init({
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
            modelName: 'StatusTypes',
            tableName: 'StatusTypes',
            timestamps: true
        });
    }
}

module.exports = StatusTypes;
