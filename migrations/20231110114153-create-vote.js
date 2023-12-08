'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			'Votes',
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
					field: 'vote_id',
				},
				vote_type: {
					type: Sequelize.ENUM('like', 'dislike'),
					allowNull: false,
				},
				user_id: {
					type: Sequelize.INTEGER.UNSIGNED,
					references: {
						model: 'users',
						key: 'id',
					},
					onDelete: 'CASCADE',
					onUpdate: 'CASCADE',
				},
				post_id: {
					type: Sequelize.INTEGER.UNSIGNED,
					references: {
						model: 'posts',
						key: 'post_id',
					},
					onDelete: 'CASCADE',
					onUpdate: 'CASCADE',
				},
				comment_id: {
					type: Sequelize.INTEGER.UNSIGNED,
					references: {
						model: 'comments',
						key: 'comment_id',
					},
					onDelete: 'CASCADE',
					onUpdate: 'CASCADE',
				},
				createdAt: {
					allowNull: false,
					type: Sequelize.DATEONLY,
				},
				updatedAt: {
					allowNull: false,
					type: Sequelize.DATEONLY,
				},
			},
			{
				uniqueKeys: {
					actions_unique: {
						fields: ['user_id', 'post_id', 'comment_id'],
					},
				},
			}
		);
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Votes');
	},
};
