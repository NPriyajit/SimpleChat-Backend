const mongoose = require('mongoose');

const dbURL = 'mongodb://localhost:27017/simpleChat';


function connectToDB() {
	mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
		.then(() => {
			console.log('Connected to the database');
		})
		.catch((err) => {
			console.error('Error connecting to the database', err);
		});
}

module.exports = connectToDB;