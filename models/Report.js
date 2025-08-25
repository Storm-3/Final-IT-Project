const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Report = sequelize.define('Report', {
    
    tableName: 'Report',
    id: 
    {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: 
    {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: 
        {
            model: 'User',
            key: 'id'
        },
    },
        date_reported: 
        {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
    },
    description: 
    {
        type: DataTypes.TEXT,
        allowNull: false
    },
    date_of_incident: 
    {
        type: DataTypes.DATE,
        allowNull: true,
        //defaultValue: DataTypes.NOW
    },
    location: 
    {
        type: DataTypes.STRING,
        allowNull: true
    },
    //incident_type: DataTypes.ENUM('physical', 'sexual', 'emotional', 'other'),
    status: 
    {
        type: DataTypes.ENUM('open', 'in_progress', 'resolved', 'closed'),
        allowNull: false,
        defaultValue: 'open'
    },
    assigned_counsellor_id: 
    {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: 
        {
            model: 'User',
            key: 'id'
        },
    },
    evidence_path: DataTypes.STRING,
    //is_anonymous: DataTypes.BOOLEAN,
});

module.exports = Report;
Report.sync({ alter: true }) // Uncomment to sync the model with the database