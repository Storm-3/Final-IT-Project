'use strict';

require('dotenv').config();
const sequelize = require('./config/database');
const db = require('./models');
const app = require('./app');

// Optional: define syncModels here or import from a separate module
async function syncModels() {
  try {
    await sequelize.sync({ alter: false }); // or { force: false } depending on your needs
    console.log('Models synchronized successfully');
  } catch (err) {
    console.error('Model synchronization failed:', err);
    throw err;
  }
}

async function startServer() {
  try {
    await sequelize.authenticate()
      .then(() => console.log('DB connected'))
      .catch(err => console.error('DB connection failed:', err));


    await syncModels();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Startup failed:', err);
    process.exit(1);
  }
}

startServer();

