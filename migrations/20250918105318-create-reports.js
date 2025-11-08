'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Reports', 
      {
        id: 
            {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: 
            {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: 
                {
                    model: 'Users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'NO ACTION'

            },
                date_reported: 
                {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.NOW
            },
            description: 
            {
                type: Sequelize.TEXT,
                allowNull: false
            },
            date_of_incident: 
            {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.NOW
            },
            location: 
            {
                type: Sequelize.STRING,
                allowNull: false
            },
            incident_type_id: {
            type: Sequelize.INTEGER,
            references: { 
                model: 'IncidentTypes', 
                key: 'id' 
            },
            onUpdate: 'CASCADE',
            onDelete: 'NO ACTION',
            allowNull: false
        },
        
           status_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'StatusTypes',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'NO ACTION'

        },
            assigned_counsellor_id: 
            {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: 
                {
                    model: 'Users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'NO ACTION'

            },
            evidence_path: Sequelize.STRING,
            is_anonymous: Sequelize.BOOLEAN,
           createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
          },
           deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
       });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Reports');
  }
};
