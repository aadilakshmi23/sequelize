'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Here to store the name of the user"
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      gender: {
        type: Sequelize.ENUM(['male', 'female']),
        allowNull: false,
        defaultValue: 'female'
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};