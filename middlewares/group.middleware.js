const middleware = (req, res, next) => {
	console.log('Group middleware');
	next();
}

module.exports = middleware;