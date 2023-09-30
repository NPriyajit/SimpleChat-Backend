const router = require('express').Router();
const User = require('../db/schema/User.schema');
const argon = require('argon2');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');

const JWT_SECRET = process.env?.JWT_SECRET ?? 'secret';
router.post('/login', body('userName').notEmpty(), async (req, res) => {
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
				phone, name, email, description
			}, JWT_SECRET);
			res.success('Successfully! send the token', token);
		} else {
			res.error('Error while authenticating!');
		}
	} catch (err) {
		console.log(err);
		res.error('Uncaught Error!');
	}
});



module.exports = router;