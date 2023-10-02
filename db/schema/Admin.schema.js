const mongoose = require('mongoose');
const argon2 = require('argon2');

const AdminObject = {
	name: { type: String },
	userName: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	createdAt: { type: Date, default: Date.now }
}

const AdminSchema = new mongoose.Schema(AdminObject);
const AdminModel = mongoose.model('Admin', AdminSchema);
AdminModel.find({}).then(async (res) => {
	if (!process.env?.DEFAULT_ADMIN_PASSWORD || !process.env?.DEFAULT_ADMIN_USERNAME) {
		console.error('Error, Can not proceed without env [ DEFAULT_ADMIN_PASSWORD, DEFAULT_ADMIN_USERNAME ]');
		process.exit(1);
	}
	if (res.length === 0) {
		const hash = await argon2.hash(process.env?.DEFAULT_ADMIN_PASSWORD);
		await AdminModel.collection.insertOne({
			name: 'Default_Admin',
			userName: process.env?.DEFAULT_ADMIN_USERNAME,
			password: hash,
		});
	}
})

module.exports = AdminModel;