'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Class.init({
    parent_id: DataTypes.INTEGER,
    tutor_id: DataTypes.INTEGER,
    request_class_id: DataTypes.INTEGER,
    address: DataTypes.STRING,
    detail_address: DataTypes.STRING,
    price: DataTypes.INTEGER,
    frequency: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Class',
    tableName: 'classes'
  });
  return Class;
};