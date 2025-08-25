const { Sequelize } = require("sequelize")

const sequelize = new Sequelize('gbv_db', 'gbv_user','user_password',{
    host: 'localhost',
    dialect: 'mysql',
    //logging: false,
});

module.exports = sequelize;