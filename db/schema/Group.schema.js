const mongoose = require('mongoose');

const GroupObject = {
	name: { type: String, unique: true, required: true },
	members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	createdAt: { type: Date, default: Date.now }
};

const GroupSchema = new mongoose.Schema(GroupObject);
module.exports = mongoose.model('Group', GroupSchema);