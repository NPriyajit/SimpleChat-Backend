const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');

const AdminObject = {
	name: { type: String },
	userName: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	createdAt: { type: Date, default: Date.now }
}

const AdminSchema = new mongoose.Schema(AdminObject);
module.exports = mongoose.model('Admin', AdminSchema);