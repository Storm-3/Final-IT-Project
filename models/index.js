'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '/../config/config.json'))[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Phase 1: Load and initialize all models
const modelRegistry = [];

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      !file.endsWith('.test.js')
    );
  })
  .forEach(file => {
    const fullPath = path.join(__dirname, file);
    let required;

    try {
      required = require(fullPath);
    } catch (err) {
      console.error(`❌ Failed to require ${file}:`, err);
      return;
    }

    const candidates = [];

    // Handle module.exports = Model
    if (typeof required === 'function') {
      candidates.push(required);
    }

    // Handle module.exports = { A, B, C }
    if (required && typeof required === 'object') {
      Object.values(required).forEach(v => {
        if (typeof v === 'function') {
          candidates.push(v);
        }
      });

      // Fallback: single object with initModel
      if (candidates.length === 0 && typeof required.initModel === 'function') {
        candidates.push(required);
      }
    }

    candidates.forEach(ModelClass => {
      try {
        if (typeof ModelClass.initModel === 'function') {
          ModelClass.initModel(sequelize);
          modelRegistry.push(ModelClass);
          console.log(`🔧 Initialized model: ${ModelClass.name}`);
        }
      } catch (err) {
        console.error(`❌ Failed to initialize model ${ModelClass.name}:`, err);
      }
    });
  });

// Phase 2: Register models and wire associations
Object.keys(sequelize.models).forEach(name => {
  db[name] = sequelize.models[name];
});

modelRegistry.forEach(ModelClass => {
  const modelInstance = db[ModelClass.name];
  if (modelInstance && typeof modelInstance.associate === 'function') {
    try {
      modelInstance.associate(db);
      console.log(`🔗 Associated model: ${ModelClass.name}`);
    } catch (err) {
      console.error(`❌ Failed to associate model ${ModelClass.name}:`, err);
    }
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

console.log('✅ Models loaded:', Object.keys(db));
module.exports = db;
