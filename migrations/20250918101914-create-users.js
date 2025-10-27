'use strict';

const { SequelizeScopeError } = require('sequelize');
const { TYPE } = require('tedious/lib/packet');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.createTable('Users', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        password: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        is_anonymous: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
          allowNull: false
        },
        name: {
          type: Sequelize.STRING,
          allowNull: true
        },
        email: {
          type: Sequelize.STRING,
          allowNull: true,
          unique: true
        },
        phone: {
          type: Sequelize.STRING,
          allowNull: true
        },
        role_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
          references: {
            model: 'UserRoles',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'NO ACTION'
        },
        resource_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'ResourceDirectories',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        status: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 'inactive',
          validate: {
            isIn: [['inactive', 'pending', 'active']] 
           }
        },
          isEmailVerified: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        verificationToken:{
          type: Sequelize.STRING,
          allowNull: true,
        },
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
    } catch (error) {
      console.error('FULL ERROR:', error);
      throw error; // rethrow so Sequelize still registers the failure
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};