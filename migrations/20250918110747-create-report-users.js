'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('ReportUsers', { 
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  report_id: {
    type: Sequelize.INTEGER,
    references: { model: 'Reports', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'NO ACTION'
  },
  user_id: {
    type: Sequelize.INTEGER,
    references: { model: 'Users', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'NO ACTION'
  },
  //role: Sequelize.STRING, // optional: e.g., 'reporter', 'witness'
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
    deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('ReportUsers');
  }
};
