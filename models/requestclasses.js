'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RequestClasses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RequestClasses.init({
    parentID: DataTypes.INTEGER,
    parentName: DataTypes.STRING,
    phone: DataTypes.STRING,
    studentGender: DataTypes.STRING,
    requiredGender: DataTypes.STRING,
    address: DataTypes.TEXT,
    grade: DataTypes.STRING,
    subject: DataTypes.STRING,
    skill: DataTypes.STRING,
    studentCharacter: DataTypes.TEXT,
    schedule: DataTypes.TEXT,
    frequency: DataTypes.INTEGER,
    salary: DataTypes.INTEGER,
    otherRequirement: DataTypes.TEXT,
    status: DataTypes.STRING,
    subjectIds: DataTypes.TEXT,
    detailAddress: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'RequestClasses',
    tableName: 'requestclasses'
  });
  return RequestClasses;
};