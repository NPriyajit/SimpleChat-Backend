const router = require('express').Router();
const { default: mongoose } = require('mongoose');
const Group = require('../db/schema/Group.schema');
const GroupMessage = require('../db/schema/Message.schema');
const { body } = require('express-validator');

// Create Group
router.post('/group',
	body('name').notEmpty().isAlphanumeric(),
	body('email').notEmpty().isEmail(),
	body('phone').notEmpty().isMobilePhone(),
	body('userName').notEmpty(),
	async (req, res) => {
		try {
			const { body } = req;
			const { name } = body;
			// save user by using User DB
			const insertData = await Group.collection.insertOne({ name });
			if (insertData.acknowledged && insertData.insertedId) {
				res.success('Successfully! Added new group', { id: insertData.insertedId });
			}
			res.error('Error while adding new group');
		} catch (err) {
			res.error('Uncaught error! something went wrong!');
		}
	});
// Edit User
router.put('/member', async (req, res) => {
	try {
		const { body } = req;
		const { userID, groupID } = body;
		// save user by using User DB
		const updatedData = await Group.collection.updateOne({ _id: new mongoose.Types.ObjectId(groupID) }, {
			$push: userID
		});
		if (updatedData.acknowledged && updatedData.matchedCount) {
			res.success('Successfully! Added new member to group');
		}
		res.error('Error while adding new member group');
	} catch (err) {
		res.error('Uncaught error! something went wrong!');
	}
});
// Fetch User
router.get('/members/:groupID', async (req, res) => {
	const { groupID } = req.params;
	const foundData = await Group.collection.aggregate({ _id: new mongoose.Types.ObjectId(groupID) }, {
		$push: userID
	}).toArray();
	if (updatedData.acknowledged && updatedData.matchedCount) {
		res.success('Successfully! Fetched all members of group', );
	}
});
// Delete User
router.delete('/user', (req, res) => {
	console.log(req.body);
});


module.exports = router;
