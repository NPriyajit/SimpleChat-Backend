const router = require('express').Router();
const argon2 = require('argon2');
const User = require('../db/schema/User.schema');
const { param, body } = require('express-validator');
const { default: mongoose } = require('mongoose');

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
				return;
			}
			res.error('Error while adding new user');
		} catch (err) {
			console.log(err.message);
			if (err.code === 11000) {
				res.error('Duplicate key present for: ' + [...Object.keys(err.keyPattern)].join(','));
				return;
			}
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
		console.log(err.message);
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
			res.success('Successfully! deleted user');
			return;
		}
		res.error('Error while deleting user');
	} catch (err) {
		res.error('Uncaught error! something went wrong!');
	}
});


module.exports = router;
