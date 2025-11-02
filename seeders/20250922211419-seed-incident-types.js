'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('IncidentTypes', [
      {
        name: 'Physical Abuse',
        description: 'Intentional use of physical force that results in harm'
      },
      {
        name: 'Emotional Abuse',
        description: 'Verbal or psychological tactics that cause emotional distress'
      },
      {
        name: 'Neglect',
        description: 'Failure to provide necessary care or support'
      },
      {
        name: 'Sexual Abuse',
        description: 'Non-consensual sexual contact or exploitation'
      },
      {
        name: 'Financial Abuse',
        description: 'Unauthorized use or control of someone’s financial resources'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('IncidentTypes', null, {});
  }
};
