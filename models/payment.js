'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Payment extends Model {
		static associate(models) {
			Payment.belongsTo(models.User, {
				foreignKey: 'user_id',
				targetKey: 'id',
			});
		}
	}

	Payment.init(
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				field: 'post_id',
			},
			amount: DataTypes.INTEGER,
			order_id: DataTypes.STRING,
			state: DataTypes.STRING,
			user_id: DataTypes.INTEGER.UNSIGNED,
			class_id: DataTypes.INTEGER.UNSIGNED,
		},
		{
			sequelize,
			tableName: 'payments',
			modelName: 'Payment',
		}
	);
	return Payment;
};
