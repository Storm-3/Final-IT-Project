'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('ResourceDirectories', 
      { id: {
              type: Sequelize.INTEGER,
              primaryKey: true,
              autoIncrement: true
          },
          name: {
              type: Sequelize.STRING,
              allowNull: false
          },
          type: {
              type: Sequelize.STRING,
              allowNull: false
          },
          description: {
              type: Sequelize.TEXT,
              allowNull: false
          },
          phone_number: {
              type: Sequelize.STRING,
              allowNull: false
          },
          email: {
              type: Sequelize.STRING,
              allowNull: true
          },
          address: {
              type: Sequelize.STRING,
              allowNull: true
          },
          website: {
              type: Sequelize.STRING,
              allowNull: true
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
          },
           deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
      });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('ResourceDirectories');
  }
};

