'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('VoiceMessages', [
      {
        id: 3, // must match a valid message ID from Messages table
        voice_content: 'uploads/voice_003.mp3',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      },
      {
        id: 4, // must match a valid message ID from Messages table
        voice_content: 'uploads/voice_004.mp3',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('VoiceMessages', null, {});
  }
};

