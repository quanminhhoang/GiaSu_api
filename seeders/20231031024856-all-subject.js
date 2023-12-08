'use strict';

/** @type {import('sequelize-cli').Migration} */
const toLocalDateTime = require("../helpers/toLocalDateTime");


const subjects = () => {
  const subjects = ['Toán', 'Vật lý', 'Hóa', 'Sinh', 'Tiếng Anh', 'Văn', 'Lịch sử', 'Địa', 'Tin', 'Toán + TV']
  const grades = ['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5', 'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12', ]
  const all_subjects = []
  subjects.forEach(subject => {
    grades.forEach(grade => {
      all_subjects.push({name: subject, grade, createdAt: toLocalDateTime(new Date()), updatedAt: toLocalDateTime(new Date())})
    })
  })
  return all_subjects
}


console.log(subjects())

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('Subjects', subjects(), {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
