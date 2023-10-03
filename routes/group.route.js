const router = require('express').Router();
const { default: mongoose } = require('mongoose');
const Group = require('../db/schema/Group.schema');
const { body } = require('express-validator');


// Fetch Groups
router.get('/', async (req, res) => {
	const findAllGroups = await Group.find({});
	return res.success('Successfully! fetched all the groups', findAllGroups);
});

// Create Group
router.post('/group',
	body('name').notEmpty().isAlphanumeric(),
	async (req, res) => {
		try {
			const { body } = req;
			const { name, userID } = body;
			if (!userID) {
				return res.error('Error: Can not proceed without userID');
			}
			// save user by using User DB
			const insertData = await Group.collection.insertOne({ name, groupAdmin: new mongoose.Types.ObjectId(userID), members: [new mongoose.Types.ObjectId(userID)] });
			if (insertData.acknowledged && insertData.insertedId) {
				res.success('Successfully! Added new group', { id: insertData.insertedId });
				return;
			}
			res.error('Error while adding new group');
		} catch (err) {
			if (err.code == 11000) {
				return res.error('A Group with same name already exists');
			}
			res.error('Uncaught error! something went wrong!');
		}
	});
// Edit User
router.put('/member', async (req, res) => {
	try {
		const { body } = req;
		const { memberID, groupID } = body;
		// save user by using User DB
		const updatedData = await Group.collection.updateOne({ _id: new mongoose.Types.ObjectId(groupID) }, {
			$addToSet: { members: new mongoose.Types.ObjectId(memberID) }
		});
		if (updatedData.acknowledged && updatedData.matchedCount) {
			res.success('Successfully! Added new member to group');
			return;
		}
		res.error('Error while adding new member group');
	} catch (err) {
		res.error('Uncaught error! something went wrong!');
	}
});
// Fetch User
router.get('/members/:groupID', async (req, res) => {
	const { groupID } = req.params;
	const foundData = await Group.collection.aggregate([
		{
			'$match': {
				'_id': new mongoose.Types.ObjectId(groupID)
			}
		}, {
			'$unwind': {
				'path': '$members'
			}
		}, {
			'$lookup': {
				'from': 'users',
				'localField': 'members',
				'foreignField': '_id',
				'as': 'employeeDetails'
			}
		},
		{
			'$unwind': {
				'path': '$employeeDetails'
			}
		},
		{
			'$project': {
				'employeeDetails._id': 1,
				'employeeDetails.name': 1,
				'employeeDetails.phone': 1,
				'employeeDetails.email': 1,
				'employeeDetails.description': 1,
				'employeeDetails.userName': 1
			}
		},
	]).toArray();
	res.success('Successfully! get members', foundData);
});



module.exports = router;
