const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env?.JWT_SECRET ?? 'secret';

const middleware = (req, res, next) => {
	const token = req.header('Authorization');
	// Check if the token is not here
	if (!token) {
		return res.error('Unauthorized - Token is missing', 401);
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		if (decoded.role !== 'admin' && decoded.role !== 'user') {
			return res.error('Unauthorized User', 401);
		}
		req.user = decoded;
		next();
	} catch (error) {
		// Token verification failed
		return res.status(401).json({ message: 'Unauthorized - Invalid token' });
	}
}

module.exports = middleware;