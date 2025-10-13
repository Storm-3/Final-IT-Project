'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Messages', [
      {
        report_id: 1,
        sender_id: 2,
        recipient_id: 1,
        message_type: 'text',
        sent_at: new Date('2025-09-22T10:15:00'),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      },
      {
        report_id: 2,
        sender_id: 4,
        recipient_id: 3,
        message_type: 'text',
        sent_at: new Date('2025-09-22T14:30:00'),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Messages', null, {});
  }
};

