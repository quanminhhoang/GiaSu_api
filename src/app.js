require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const db = require('../models/index');
const user = require('../models/user');
const appRoute = require('../routers/index');

const app = express();
const PORT = 10000;

app.use(cors());

app.use(function (req, res, next) {
	// res.header("Access-Control-Allow-Origin", "*");
	// res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
	// res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, x_authorization'
	);
	next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/api/test', (req, res) => {
	res.json('This is test route');
});

app.use('/api', appRoute);

app.use((err, req, res, next) => {
	const status = err.statusCode || 500;
	// if (status === 500) {
	//   message = "Something is broken"
	// } else message = err.message;
	let resData;
	if (err.errors) {
		resData = { message: err.message, errors: err.errors };
	} else {
		resData = { message: err.message };
	}

	res.status(status).json(resData);
});

app.listen(PORT, () => {
	console.info(`App listening on port ${PORT}`);
});
