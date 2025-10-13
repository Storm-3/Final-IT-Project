const { Sequelize } = require("sequelize")

const sequelize = new Sequelize('gbv_db', 'gbv_user','user_password123',{
    host: 'localhost',
    port: 1433,
    dialect: 'mssql',
    dialectOptions: {
        //instanceName: 'SQLEXPRESS01',
        options: {
            encrypt: false, // true if using azure or ssl?????
        trustServerCertificate: true //for local dev 
        },  
        //logging: false,
    },
});

module.exports = sequelize;