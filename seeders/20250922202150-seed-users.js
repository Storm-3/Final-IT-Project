'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        password: 'hashed_password_1',
        is_anonymous: false,
        name: 'Greek Gran',
        email: 'greek.gran@example.com',
        phone: '0821234567',
        role_id: 2, // counsellor
        resource_id: 1, // Safe Haven Shelter,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        password: 'Password123',
        is_anonymous: false,
        name: 'The Lawyer',
        email: 'youknow.who@example.com',
        phone: '0839876543',
        role_id: 1, // survivor
        resource_id: 3, // Siyakhula Counselling Services
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        password: null,
        is_anonymous: true,
        name: null,
        email: null,
        phone: null,
        role_id: 1, // survivor
        resource_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        password: '123Password',
        is_anonymous: false,
        name: 'Bleek.',
        email: 'nota.gun@example.com',
        phone: '0845556677',
        role_id: 3, // admin
        resource_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};

