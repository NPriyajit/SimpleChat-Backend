const router = require('express').Router();
const User = require('../db/schema/User.schema');
// Fetch User
router.get('/users', async (req, res) => {
	try {
		const allUsers = await User.find({}, {
			name: 1,
			phone: 1,
			email:  1,
			description: 1,
			userName: 1,
			createdAt: 1
		});
		res.success('All Users Data', allUsers);
	} catch (err) {
		console.log(err.message);
		res.error('Uncaught error! something went wrong!');
	}
});

// Fetch User by id
router.get('/users/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id);
		res.success('Users Data', user);
	} catch (err) {
		console.log(err.message);
		res.error('Uncaught error! something went wrong!');
	}
});

module.exports = router;