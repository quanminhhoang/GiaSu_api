'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Vote extends Model {
		static associate(models) {
			Vote.belongsTo(models.User, {
				foreignKey: 'id',
				targetKey: 'id',
			});
			Vote.belongsTo(models.Post, {
				foreignKey: 'post_id',
				targetKey: 'id',
			});
			Vote.belongsTo(models.Comment, {
				foreignKey: 'comment_id',
				targetKey: 'id',
			});
		}
	}
	Vote.init(
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				field: 'vote_id',
			},
			vote_type: { type: DataTypes.ENUM('like', 'dislike'), allowNull: false },
			user_id: DataTypes.INTEGER.UNSIGNED,
			post_id: DataTypes.INTEGER,
			comment_id: DataTypes.INTEGER,
		},
		{
			sequelize,
			tableName: 'votes',
			modelName: 'Vote',
		}
	);
	return Vote;
};
