function customSuccessResponse(req, res, next) {
	res.success = (message, data) => {
		return res.status(200).json({ success: true, data, message });
	};
	next();
}
function customErrorResponse(req, res, next) {
	res.error = (message, status) => {
		return res.status(status ?? 500).json({ success: false, message });
	};
	next();
}

module.exports = { customSuccessResponse, customErrorResponse };