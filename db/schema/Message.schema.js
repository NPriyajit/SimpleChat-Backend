const mongoose = require('mongoose');

const MessageObject = {
	sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
	content: { type: String, required: true },
	likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	timestamp: { type: Date, default: Date.now },
};

const MessageSchema = new mongoose.Schema(MessageObject);
module.exports = mongoose.model('GroupMessage', MessageSchema);