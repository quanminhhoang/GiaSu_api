'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
sequelize = new Sequelize('giasu_api', 'root', '', {
	host: '0.0.0.0',
	dialect: 'mysql',
});

fs.readdirSync(__dirname)
	.filter((file) => {
		return (
			file.indexOf('.') !== 0 &&
			file !== basename &&
			file.slice(-3) === '.js' &&
			file.indexOf('.test.js') === -1
		);
	})
	.forEach((file) => {
		const model = require(path.join(__dirname, file))(
			sequelize,
			Sequelize.DataTypes
		);
		db[model.name] = model;
	});

Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Export model
const User = require('./user')(sequelize, Sequelize);
const Post = require('./post')(sequelize, Sequelize);
const Comment = require('./comment')(sequelize, Sequelize);
const Vote = require('./vote')(sequelize, Sequelize);
const Payment = require('./payment')(sequelize, Sequelize);

module.exports = db;
