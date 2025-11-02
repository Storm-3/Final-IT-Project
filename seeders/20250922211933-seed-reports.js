'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Reports', [
      {
        user_id: 1,
        date_reported: new Date(),
        description: 'Survivor reported physical abuse incident at home.',
        date_of_incident: new Date('2025-09-20'),
        location: 'KwaZakhele, Gqeberha',
        incident_type_id: 1, // Physical Abuse
        status_id: 1, // Pending
        assigned_counsellor_id: 2,
        evidence_path: null,
        is_anonymous: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: 3,
        date_reported: new Date(),
        description: 'Anonymous report of financial exploitation by a relative.',
        date_of_incident: new Date('2025-09-18'),
        location: 'Motherwell, Gqeberha',
        incident_type_id: 5, // Financial Abuse
        status_id: 2, // In Progress
        assigned_counsellor_id: 4,
        evidence_path: 'uploads/evidence_002.jpg',
        is_anonymous: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Reports', null, {});
  }
};

