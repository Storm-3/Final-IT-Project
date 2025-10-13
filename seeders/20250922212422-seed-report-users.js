'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      console.log('🚀 Seeding ReportUsers...');

      const timestamp = new Date();

      await queryInterface.bulkInsert('ReportUsers', [
        {
          reportId: 1,
          userId: 3,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          reportId: 2,
          userId: 1,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ], {});

      console.log('✅ ReportUsers seeded successfully');
    } catch (error) {
      console.error('❌ Error seeding ReportUsers:', error.message);
      console.error(error); // Full error object for debugging
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      console.log('🧹 Cleaning up ReportUsers...');
      await queryInterface.bulkDelete('ReportUsers', null, {});
      console.log('✅ ReportUsers cleanup complete');
    } catch (error) {
      console.error('❌ Error cleaning up ReportUsers:', error.message);
      console.error(error);
    }
  }
};

