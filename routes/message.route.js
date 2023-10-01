const router = require('express').Router();
const { default: mongoose } = require('mongoose');
const Group = require('../db/schema/Group.schema');
const GroupMessage = require('../db/schema/Message.schema');
const { body } = require('express-validator');


// Fetch Groups
router.get('/', async (req, res) => {
	const findAllGroups = await Group.find({});
	return res.success('Successfully! fetched all the groups', findAllGroups);
});

// Create Group
router.post('/groupMessage',
	body('name').notEmpty().isAlphanumeric(),
	async (req, res) => {
		try {
			const { body } = req;
			const { senderID, groupID, content } = body;
			if (!userID) {
				return res.error('Error: Can not proceed without userID');
			}
			// save user by using User DB
			const insertData = await Group.collection.insertOne({ senderID: new mongoose.Types.ObjectId(senderID), groupID: new mongoose.Types.ObjectId(groupID), content, likes: 0 });
			if (insertData.acknowledged && insertData.insertedId) {
				res.success('Successfully! Added new group', { id: insertData.insertedId });
			}
			res.error('Error while adding new group');
		} catch (err) {
			res.error('Uncaught error! something went wrong!');
		}
	});
// Edit User
router.put('/groupMessage/like', async (req, res) => {
	try {
		const { body } = req;
		const { messageID } = body;
		// save user by using User DB
		const updatedData = await Group.collection.updateOne({ _id: new mongoose.Types.ObjectId(messageID) }, {
			$inc: { likes: 1 }
		});
		if (updatedData.acknowledged && updatedData.matchedCount) {
			res.success('Successfully! Liked Message');
			return;
		}
		res.error('Error while liking the message');
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