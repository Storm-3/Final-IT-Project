'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.bulkInsert('Articles', [
        {
          user_id: 1,
          title: 'Recognizing the Signs of Gender-Based Violence',
          content: 'This article outlines common indicators of GBV, including emotional, physical, and financial abuse, and offers guidance on how to respond safely.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 1,
          title: 'Creating Safe Spaces for Survivors',
          content: 'Explore strategies for building trauma-informed environments—whether online or in person—that prioritize survivor dignity, privacy, and empowerment.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 1,
          title: 'The Role of Bystanders in Preventing GBV',
          content: 'Learn how active bystander intervention can disrupt cycles of violence and foster community accountability, with practical examples and ethical considerations.',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], {});
    } catch (error) {
      console.error('❌ Seeder failed:', error);
      if (error.errors) {
        error.errors.forEach((e, i) => {
          console.error(`🔍 Error ${i + 1}:`, e.message, '| Path:', e.path, '| Value:', e.value);
        });
      }
      throw error; // rethrow to ensure CLI exits with failure
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Articles', null, {});
  }
};
