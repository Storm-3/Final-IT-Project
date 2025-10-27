'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('UserRoles', 
      { id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      role_name:{
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: [['survivor', 'counsellor', 'admin']]
        }
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      }
      });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('UserRoles');
  }
};
