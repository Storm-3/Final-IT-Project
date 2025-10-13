'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [
     *   {}
     * ], {});
     */

    await queryInterface.bulkInsert('ImageMessages', [
      {
        id: 1, // must match a valid message ID from Messages table
        image_path: 'uploads/image_001.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      },
      {
        id: 2, // must match a valid message ID from Messages table
        image_path: 'uploads/image_002.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ImageMessages', null, {});
  }
};
