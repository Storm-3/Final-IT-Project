module.exports = {
  development: {
    username: "sqladmin",
    password: "Admin_Login",
    database: "gbv_db",
    host: "gbvserver.database.windows.net",
    dialect: "mssql",
    port: 1433,
    dialectOptions: {
      options: {
        encrypt: true, // ✅ required for Azure
        enableArithAbort: true, // ✅ recommended
        trustServerCertificate: false,
      },
    },
    logging: console.log,
  },
};
