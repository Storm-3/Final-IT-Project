'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('StatusTypes', 
      {
         id: {
             type: Sequelize.INTEGER,
             primaryKey: true,
             autoIncrement: true
           },
           name: {
             type: Sequelize.STRING,
             allowNull: false,
             unique: true
           },
           description: Sequelize.TEXT 
        });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('StatusTypes');
  }
};
