const mongoose = require('mongoose');

const dbURL = process.env.DB_URL;

async function connectToDB() {
	await mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });
}

module.exports = connectToDB;