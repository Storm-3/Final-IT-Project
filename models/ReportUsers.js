const { DataTypes, Model } = require('sequelize');

class ReportUsers extends Model {
    // No associations needed here—handled via belongsToMany in Users and Reports
    static initModel(sequelize) {
        ReportUsers.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            report_id: {
                type: DataTypes.INTEGER,
                allowNull: false
                // references: { model: 'Reports', key: 'id' }
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false
                // references: { model: 'Users', key: 'id' }
            }
        }, {
            sequelize,
            modelName: 'ReportUsers',
            tableName: 'ReportUsers',
            timestamps: true,
            paranoid: true
        });
    }
}

module.exports = ReportUsers;
