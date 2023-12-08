'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RequestClasses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // id: {
      //   primaryKey: true,
      //   autoIncrement: true,
      //   allowNull: false,
      //   type: Sequelize.INTEGER
      // },
      parentID: {
        type: Sequelize.INTEGER
      },
      parentName: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      studentGender: {
        type: Sequelize.STRING
      },
      requiredGender: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.TEXT
      },
      detailAddress: {
        type: Sequelize.TEXT
      },
      grade: {
        type: Sequelize.STRING
      },
      subject: {
        type: Sequelize.STRING
      },
      skill: {
        type: Sequelize.STRING
      },
      studentCharacter: {
        type: Sequelize.TEXT
      },
      schedule: {
        type: Sequelize.TEXT
      },
      frequency: {
        type: Sequelize.INTEGER
      },
      salary: {
        type: Sequelize.INTEGER
      },
      otherRequirement: {
        type: Sequelize.TEXT
      },
      subjectIds: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('RequestClasses');
  }
};