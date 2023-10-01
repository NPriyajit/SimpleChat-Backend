const mongoose = require('mongoose');

const dbURL = 'mongodb://localhost:27017/simpleChat';

async function connectToDB() {
	await mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });
}

module.exports = connectToDB;