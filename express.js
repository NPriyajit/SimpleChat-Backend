
const PORT = process.env.PORT || 5000;
const app = require('./app');
app.listen(PORT, (err) => {
	if (err) {
		console.error('Error while listening to port!' + PORT);
		return;
	}
	console.log(':) Listening to port!' + PORT);
});