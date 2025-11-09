
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Sequelize has a built-in option for this!
    const options = {
      identityInsert: true, // This tells Sequelize to handle IDENTITY_INSERT for MS SQL
    };

    await queryInterface.bulkInsert(
      'UserRoles',
      [
        {
          //id: 1, // Explicitly set ID
          role_name: 'survivor',
        },
        {
          //id: 2, // Explicitly set ID
          role_name: 'counsellor',
        },
        {
          //id: 3, // Explicitly set ID
          role_name: 'admin',
        },
      ],
      options // Pass the options object here
    );
  },

  down: async (queryInterface, Sequelize) => {
    // The down method is fine
    await queryInterface.bulkDelete('UserRoles', null, {});
  },
};