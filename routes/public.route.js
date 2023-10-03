const router = require('express').Router();
const User = require('../db/schema/User.schema');
const argon = require('argon2');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const Admin = require('../db/schema/Admin.schema');
const JWT_SECRET = process.env?.JWT_SECRET ?? 'secret';

router.post('/login/user', body('userName').notEmpty(), async (req, res) => {
	try {
		const { body: { userName, password } } = req;
		// find the user from DB;
		const user = await User.findOne({ userName });
		if (!user) {
			res.error('Error while fetching user');
			return;
		}
		const { phone, name, email, description, password: hashedPassword } = user;
		if (await argon.verify(hashedPassword, password)) {
			const token = jwt.sign({
				phone, name, email, description, role: 'user'
			}, JWT_SECRET);
			res.success('Successfully! send the token', token);
		} else {
			res.error('Error while authenticating!');
		}
	} catch (err) {
		res.error('Uncaught Error!');
	}
});

// Admin Login

router.post('/login/admin', async (req, res) => {
	try {
		const { body: { userName, password } } = req;
		// find the user from DB;
		const user = await Admin.findOne({ userName });
		if (!user) {
			res.error('Error while fetching user');
			return;
		}
		const { name, password: hashedPassword } = user;
		if (await argon.verify(hashedPassword, password)) {
			try {
				const token = jwt.sign({
					name,
					role: 'admin'
				}, JWT_SECRET);
				res.success('Successfully! send the token', { token });
			} catch (jwtFailure) {
				res.error('Error while signing token');
				return;
			}
		} else {
			res.error('Error while authenticating!');
		}
	} catch (err) {
		res.error('Uncaught Error!');
	}
});



module.exports = router;