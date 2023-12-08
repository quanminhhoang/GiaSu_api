'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Post extends Model {
		static associate(models) {
			Post.belongsTo(models.User, {
				foreignKey: 'id',
				targetKey: 'id',
			});
			Post.hasMany(models.Comment, {
				foreignKey: 'post_id',
			});
			Post.hasMany(models.Vote, {
				foreignKey: 'post_id',
			});
		}
	}

	Post.init(
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				field: 'post_id',
			},
			post_title: DataTypes.STRING,
			post_content: DataTypes.TEXT,
			user_id: DataTypes.INTEGER.UNSIGNED,
		},
		{
			sequelize,
			tableName: 'posts',
			modelName: 'Post',
		}
	);
	return Post;
};
