'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('TextMessages', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      references: { model: 'Messages', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    text_content: {
      type: Sequelize.TEXT,
      allowNull: false
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
    deletedAt: Sequelize.DATE
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('TextMessages');
  }
};
