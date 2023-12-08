'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			User.hasOne(models.Tutor, {
				foreignKey: 'userID',
			});
			User.hasOne(models.Parent, {
				foreignKey: 'user_id',
			});
			User.hasOne(models.Admin, {
				foreignKey: 'user_id',
			});
			User.hasMany(models.Comment, {
				foreignKey: 'user_id',
			});
			User.hasMany(models.Post, {
				foreignKey: 'user_id',
			});
			User.hasMany(models.Vote, {
				foreignKey: 'user_id',
			});
		}
	}
	User.init(
		{
			name: DataTypes.STRING,
			email: DataTypes.STRING,
			role: DataTypes.ENUM('admin', 'tutor', 'parents'),
			password: DataTypes.STRING,
			gender: DataTypes.ENUM('male', 'female', 'others', ''),
			birth: DataTypes.DATEONLY,
			phone_number: DataTypes.STRING(20),
			address: DataTypes.STRING,
			profile_picture: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'User',
			tableName: 'users',
		}
	);
	return User;
};
