'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('StatusTypes', [
      {
        name: 'Pending',
        description: 'Awaiting review or action'
      },
      {
        name: 'In Progress',
        description: 'Currently being handled'
      },
      {
        name: 'Resolved',
        description: 'Successfully addressed'
      },
      {
        name: 'Closed',
        description: 'Finalized and archived'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('StatusTypes', null, {});
  }
};
