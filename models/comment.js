'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Comment extends Model {
		static associate(models) {
			Comment.belongsTo(models.User, {
				foreignKey: 'id',
				targetKey: 'id',
			});
			Comment.belongsTo(models.Post, {
				foreignKey: 'post_id',
				targetKey: 'id',
			});
			Comment.hasMany(models.Vote, {
				foreignKey: 'comment_id',
			});
		}
	}

	Comment.init(
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				field: 'comment_id',
			},
			comment_content: DataTypes.STRING,
			user_id: DataTypes.INTEGER.UNSIGNED,
			post_id: DataTypes.INTEGER,
		},
		{
			sequelize,
			tableName: 'comments',
			modelName: 'Comment',
		}
	);
	return Comment;
};
