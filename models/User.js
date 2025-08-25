const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    tableName: 'User',
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    is_anonymous: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    //is it necessary?
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'survivor',
        validate: {
            isIn: [['survivor', 'counsellor', 'admin']]
        }
    },
    resource_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'ResourceDirectory',
            key: 'id'
        }
    },
});

//survivor annonymity ensured, while counsellors and admins must provide name and email.
//when a counsellor/admin updates information, ensure they provide name and email.
function validateUserFields(user) {
     if (user.role === 'counsellor'){
    if (!user.name ||!user.password || !user.email || !user.phone || !user.resource_id){
        throw new Error('Counsellors are required to provide their name, email, phone numbers, ' 
            + 'and must be affiliated with a partnering organisation.')
    }
    } else if (user.role === 'admin') {
        if (!user.name || !user.email ||!user.password) {
            throw new Error('Admins are required to provide their name and email.');
        }
    }
  };

User.beforeCreate(validateUserFields);
User.beforeUpdate(validateUserFields);
 
module.exports = User;
User.sync({ alter: true }) // Uncomment to sync the model with the database

