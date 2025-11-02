"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(path.join(__dirname, "/../config/config.js"))[env];
const db = {};

// ✅ Create Sequelize connection with Azure-safe settings
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: "mssql",
    port: config.port,
    logging: console.log,
    dialectOptions: {
      options: {
        encrypt: true, // required by Azure
        enableArithAbort: true,
        trustServerCertificate: false,
      },
    },
  }
);

// ✅ Step 1: Initialize all models
fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.endsWith(".js")
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file));
    if (typeof model.initModel === "function") {
      model.initModel(sequelize);
      console.log(`🔧 Initialized model: ${model.name}`);
    }
  });

// ✅ Step 2: Add models to db object
Object.keys(sequelize.models).forEach((modelName) => {
  db[modelName] = sequelize.models[modelName];
});

// ✅ Step 3: Run all associations *after* all models are loaded
Object.keys(db).forEach((modelName) => {
  if (typeof db[modelName].associate === "function") {
    try {
      db[modelName].associate(db);
      console.log(`🔗 Associated: ${modelName}`);
    } catch (err) {
      console.error(`❌ Association failed for ${modelName}:`, err.message);
    }
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

console.log("✅ Models loaded:", Object.keys(db));
module.exports = db;
