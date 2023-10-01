const router = require('express').Router();
const { default: mongoose } = require('mongoose');
const Group = require('../db/schema/Group.schema');
const GroupMessage = require('../db/schema/Message.schema');
const { body } = require('express-validator');


// Create Group
router.post('/',
	body('name').notEmpty().isAlphanumeric(),
	async (req, res) => {
		try {
			const { body } = req;
			const { senderID, groupID, content } = body;
			if (!senderID) {
				return res.error('Error: Can not proceed without sender ID');
			}
			// save user by using User DB
			const insertData = await GroupMessage.collection.insertOne({ senderID: new mongoose.Types.ObjectId(senderID), groupID: new mongoose.Types.ObjectId(groupID), content, likes: [] });
			if (insertData.acknowledged && insertData.insertedId) {
				res.success('Successfully! Added new group', { id: insertData.insertedId });
				return;
			}
			res.error('Error while adding new group');
		} catch (err) {
			console.log(err);
			res.error('Uncaught error! something went wrong!');
		}
	});
// Edit User
router.patch('/like/:messageID', async (req, res) => {
	try {
		const { body,params } = req;
		const { messageID } = params;
		const { userID } = body;
		if (!userID) {
			return res.error('Error: Can not proceed without userID');
		}
		// save user by using User DB
		const updatedData = await GroupMessage.collection.updateOne({ _id: new mongoose.Types.ObjectId(messageID) }, {
			$addToSet: { likes: userID }
		});
		if (updatedData.acknowledged && updatedData.matchedCount) {
			res.success('Successfully! Liked Message');
			return;
		}
		res.error('Error while liking the message');
	} catch (err) {
		console.log(err)
		res.error('Uncaught error! something went wrong!');
	}
});
// Fetch User
router.get('/all/:groupID', async (req, res) => {
	const { groupID } = req.params;
	const foundData = await GroupMessage.collection.aggregate([
		{
			'$match': {
				'groupID': new mongoose.Types.ObjectId(groupID)
			}
		}, {
			'$lookup': {
				'from': 'users',
				'localField': 'senderID',
				'foreignField': '_id',
				'as': 'user'
			}
		},
		{
			'$unwind': {
				'path': '$user'
			}
		},
		{
			'$project': {
				groupID: 1,
				content: 1,
				likes: 1,
				user: {
					_id: 1,
					name: 1,
					phone: 1,
					email: 1,
					description: 1,
					userName: 1
				}
			}
		}
	]).toArray();
	res.success('Successfully! get messages', foundData);
});


module.exports = router;