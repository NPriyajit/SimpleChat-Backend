const router = require('express').Router();
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const User = require('../db/schema/User.schema');
const Admin = require('../db/schema/Admin.schema');
const { param, body } = require('express-validator');
const { default: mongoose } = require('mongoose');
router.get('/login', body('userName').notEmpty(), async (req, res) => {
	try {
		const { body: { userName, password } } = req;
		// find the user from DB;
		const user = await Admin.findOne({ userName });
		if (!user) {
			res.error('Error while fetching user');
		}
		const { name, password: hashedPassword } = user;
		if (await argon2.verify(hashedPassword, password)) {
			const token = jwt.sign({
				name
			});
			res.success('Successfully! send the token', token);
		} else {
			res.error('Error while authenticating!');
		}
	} catch (err) {
		console.log(err);
		res.error('Uncaught Error!');
	}
});

// Add User
router.post('/user',
	body('name').notEmpty().isAlphanumeric(),
	body('email').notEmpty().isEmail(),
	body('phone').notEmpty().isMobilePhone(),
	body('userName').notEmpty(),
	async (req, res) => {
		try {
			const { body } = req;
			const { name, phone, email, description, userName } = body;
			if (!userName) {
				return res.error('Can not proceed without a userName');
			}
			const hash = await argon2.hash(process.env?.DEFAULT_PASSWORD ?? 'password');
			// save user by using User DB
			const insertData = await User.collection.insertOne({ name, phone, email, description, userName, password: hash });
			if (insertData.acknowledged && insertData.insertedId) {
				res.success('Successfully! Added new user', { id: insertData.insertedId });
			}
			res.error('Error while adding new user');
		} catch (err) {
			console.log(err);
			res.error('Uncaught error! something went wrong!');
		}
	});
// Edit User
router.put('/user/:id', param('id').notEmpty().isObject(), async (req, res) => {
	try {
		const { body, params } = req;
		const { id } = params;
		const { name, phone, email, description } = body;
		const result = {};
		// save user by using User DB
		if (name) {
			result['name'] = name;
		}
		if (phone) {
			result['phone'] = phone;
		}
		if (email) {
			result['email'] = email;
		}
		if (description) {
			result['description'] = description;
		}
		const updatedData = await User.collection.updateOne({ _id: new mongoose.Types.ObjectId(id) }, {
			$set: { ...result }
		});
		if (updatedData.acknowledged && updatedData.matchedCount) {
			res.success('Successfully! Updated user');
			return;
		}
		res.error('Error while updating user');
	} catch (err) {
		console.log(err);
		res.error('Uncaught error! something went wrong!');
	}
});
// Fetch User
router.get('/users', async (req, res) => {
	try {
		const allUsers = await User.find({});
		res.success('All Users Data', allUsers);
	} catch (err) {
		console.log(err);
		res.error('Uncaught error! something went wrong!');
	}
});
// Delete User
router.delete('/user/:id', param('id').notEmpty().isObject(), async (req, res) => {
	try {
		const { params } = req;
		const { id } = params;
		const deletedData = await User.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
		if (deletedData.acknowledged && deletedData.deletedCount) {
			res.success('Successfully! Updated user');
			return;
		}
		res.error('Error while updating user');
	} catch (err) {
		console.log(err);
		res.error('Uncaught error! something went wrong!');
	}
});


module.exports = router;