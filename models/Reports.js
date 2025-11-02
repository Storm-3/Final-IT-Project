const { DataTypes, Model } = require('sequelize');

class Reports extends Model {
    static associate(models) {
        // Report o-> StatusType
        Reports.belongsTo(models.StatusTypes, { foreignKey: 'status_id' });

        // Report o-> IncidentType
        Reports.belongsTo(models.IncidentTypes, { foreignKey: 'incident_type_id' });

        // Report <-o User
        Reports.belongsTo(models.Users, { foreignKey: 'user_id', as: 'madeReports' });
        Reports.belongsTo(models.Users, { foreignKey: 'assigned_counsellor_id', as: 'assignedReports' });

        // Report o<-o User (linked)
        Reports.belongsToMany(models.Users, { through: models.ReportUsers, as: 'linkedReports' });
    }

    static initModel(sequelize) {
        Reports.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                // references: { model: 'User', key: 'id' }
            },
            date_reported: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            date_of_incident: {
                type: DataTypes.DATE,
                allowNull: true,
                // defaultValue: DataTypes.NOW
            },
            location: {
                type: DataTypes.STRING,
                allowNull: false
            },
            incident_type_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                // references: { model: 'IncidentTypes', key: 'id' }
            },
            status_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                // references: { model: 'StatusTypes', key: 'id' }
            },
            assigned_counsellor_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                // references: { model: 'User', key: 'id' }
            },
            evidence_path: DataTypes.STRING,
            // is_anonymous: DataTypes.BOOLEAN
        }, {
            sequelize,
            modelName: 'Reports',
            tableName: 'Reports',
            timestamps: true,
            paranoid: true
        });
    }
}

module.exports = Reports;
