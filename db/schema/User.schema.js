const mongoose = require('mongoose');

const UserObject = {
	name: { type: String },
	phone: { type: String, unique: true, required: true },
	description: { type: String, },
	username: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	createdAt: { type: Date, default: Date.now }
}

const UserSchema = new mongoose.Schema(UserObject);
module.exports = mongoose.model('User', UserSchema);