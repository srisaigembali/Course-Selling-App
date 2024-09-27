const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
	const token = req.headers.authorization.split(" ")[1];
	const decoded = jwt.verify(token, process.env.JWT_ADMIN_PASSWORD);

	if (decoded) {
		req.adminId = decoded.id;
		next();
	} else {
		res.status(403).json({
			message: "You are not signed in",
		});
	}
};

module.exports = adminMiddleware;
