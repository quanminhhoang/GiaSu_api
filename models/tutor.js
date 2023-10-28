"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Tutor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tutor.belongsTo(models.User, {
        foreignKey: "user_id",
      });
    }
  }
  Tutor.init(
    {
      user_id: DataTypes.INTEGER.UNSIGNED,
      fullname: DataTypes.STRING,
      bio: DataTypes.TEXT,
      education_background: DataTypes.TEXT,
      certificate: DataTypes.TEXT,
      teaching_experience: DataTypes.TEXT,
      check_status: DataTypes.STRING,
      availability: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Tutor",
      tableName: "tutors",
    }
  );
  return Tutor;
};
