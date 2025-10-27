module.exports = {
  development: {
    use_env_variable: null,
    username: process.env.DB_USER || 'gbv_user',
    password: process.env.DB_PASSWORD || 'User_password123!',
    database: process.env.DB_NAME || 'gbv_db',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mssql',
    port: 1433,
  },
};

