'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tutor_request_class extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tutor_request_class.init({
    tutor_id: DataTypes.INTEGER,
    request_class_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tutor_request_class',
    tableName: 'tutor_request_classes'
  });
  return tutor_request_class;
};