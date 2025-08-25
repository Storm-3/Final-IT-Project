const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const ResourceDirectory = sequelize.define('ResourceDirectory', {
    
    tableName: 'ResourceDirectory',
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    phone_number: DataTypes.INTEGER,
    email: DataTypes.STRING,
    address: DataTypes.STRING,
    website: DataTypes.STRING
});

module.exports = ResourceDirectory;
ResourceDirectory.sync({ alter: true })