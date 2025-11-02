'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

      await queryInterface.bulkInsert('UserRoles', [
        {role_name: 'survivor'}, //id 1
        {role_name: 'counsellor'}, //id 2
        {role_name: 'admin'} //id 3
      ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('UserRoles', null, {});
  }
};
