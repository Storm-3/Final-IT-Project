'use strict';

const bcrypt = require('bcrypt');
const saltRounds = 10;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [
      {
        password: 'hashed_password_1',
        is_anonymous: false,
        name: 'Greek Gran',
        email: 'greek.gran@example.com',
        phone: '0821234567',
        role_id: 2, // counsellor
        resource_id: 1, // Safe Haven Shelter
        status: 'active',
        isEmailVerified: true,
        verificationToken: null,
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
        status: 'active',
        isEmailVerified: true,
        verificationToken: null,
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
        status: 'active',
        isEmailVerified: true,
        verificationToken: null,
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
        status: 'active',
        isEmailVerified: true,
        verificationToken: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Hash passwords for all non-anonymous users
    const hashedUsers = await Promise.all(
      users.map(async user => {
        if (user.password) {
          const hashedPassword = await bcrypt.hash(user.password, saltRounds);
          return { ...user, password: hashedPassword };
        }
        return user;
      })
    );

    await queryInterface.bulkInsert('Users', hashedUsers);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
