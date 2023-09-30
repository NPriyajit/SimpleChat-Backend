const middleware = (req, res, next) => {
	console.log('User middleware');
	next();
}

module.exports = middleware;