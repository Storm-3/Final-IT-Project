'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ResourceDirectories', [
      {
        name: 'Safe Haven Shelter',
        type: 'Shelter',
        description: 'Emergency accommodation and support for survivors of gender-based violence.',
        phone_number: '0800 123 456',
        email: 'contact@safehaven.org.za',
        address: '12 Hope Street, Gqeberha',
        website: 'https://safehaven.org.za',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Thuthuzela Care Centre',
        type: 'Medical',
        description: 'Integrated medical and legal support for GBV survivors, including trauma counselling.',
        phone_number: '041 456 7890',
        email: 'info@thuthuzela.gov.za',
        address: 'Nelson Mandela Academic Hospital, Mthatha',
        website: 'https://thuthuzela.gov.za',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Siyakhula Counselling Services',
        type: 'Counselling',
        description: 'Free and confidential counselling for survivors and families affected by GBV.',
        phone_number: '087 654 3210',
        email: 'support@siyakhula.org.za',
        address: '45 Ubuntu Avenue, East London',
        website: 'https://siyakhula.org.za',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'GBV Helpline South Africa',
        type: 'Hotline',
        description: '24/7 national helpline offering crisis support and referrals for GBV cases.',
        phone_number: '0800 428 428',
        email: null,
        address: null,
        website: 'https://gbvhelpline.org.za',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ResourceDirectories', null, {});
  }
};

