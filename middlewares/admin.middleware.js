const middleware = (req, res, next) => {
	console.log('Admin middleware');
	next();
}

module.exports = middleware;