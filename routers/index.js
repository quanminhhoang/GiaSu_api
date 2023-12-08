const express = require('express');

const authRoute = require('./auth.router');
const tutorRoute = require('./tutor.router');
const parentsRoute = require('./parents.router');
const adminRoute = require('./admin.routers');
const classRoute = require('./class.router');
const uploadRoute = require('./upload.router');
const addressRoute = require('./address.router');
const postRoute = require('./post.router');
const commentRoute = require('./comment.router');
const paymentRoute = require('./payment.router');

const appRoute = express();

appRoute.use('/auth', authRoute);

appRoute.use('/tutor', tutorRoute);
appRoute.use('/parents', parentsRoute);
appRoute.use('/admin', adminRoute);
appRoute.use('/class', classRoute);
appRoute.use('/upload', uploadRoute);
appRoute.use('/address', addressRoute);
appRoute.use('/post', postRoute);
appRoute.use('/comment', commentRoute);
appRoute.use('/payment', paymentRoute);

module.exports = appRoute;
