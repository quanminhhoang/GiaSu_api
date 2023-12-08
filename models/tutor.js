'use strict';
const { Model } = require('sequelize');
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
				foreignKey: 'userId',
			});
		}
	}
	Tutor.init(
		{
			userID: DataTypes.INTEGER.UNSIGNED,
			name: DataTypes.STRING,
			phone: DataTypes.TEXT,
			school: DataTypes.TEXT,
			specialized: DataTypes.TEXT,
			job: DataTypes.TEXT,
			expTeach: DataTypes.INTEGER,
			subjectRange: DataTypes.TEXT,
			classRange: DataTypes.TEXT,
			skillRange: DataTypes.TEXT,
			subjectIds: DataTypes.TEXT,
			schedule: DataTypes.TEXT,
			description: DataTypes.TEXT,
			role: DataTypes.STRING,
			status: DataTypes.STRING,
			avatar: DataTypes.TEXT,
			gender: DataTypes.STRING,
			birth: DataTypes.DATE,
			address: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'Tutor',
			tableName: 'tutors',
		}
	);
	return Tutor;
};
