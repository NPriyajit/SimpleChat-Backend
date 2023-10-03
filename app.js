const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');


// internal requires
const admin = require('./routes/admin.route');
const groups = require('./routes/group.route');
const user = require('./routes/user.route');
const publicRoute = require('./routes/public.route');
const groupMessage = require('./routes/message.route');


// middlewares
const adminMiddleware = require('./middlewares/admin.middleware');
const userMiddleware = require('./middlewares/user.middleware');
const multipleMiddleware = require('./middlewares/multiple.middleware');
const { customSuccessResponse, customErrorResponse } = require('./custom/response');
const connectToDB = require('./db/connect.db');
// DB connection
connectToDB();

app.use(bodyParser.json());
// Custom response
app.use(customSuccessResponse);
app.use(customErrorResponse);


// Routes

app.use('/api', publicRoute);
app.use('/api/admin', adminMiddleware, admin);
app.use('/api/user', multipleMiddleware, user);
app.use('/api/groups', userMiddleware, groups);
app.use('/api/groupMessage', userMiddleware, groupMessage);




app.get('/api', (req, res) => {
	res.success('Hello', null);
});




module.exports = app;