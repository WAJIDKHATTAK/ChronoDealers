/* eslint-disable no-unused-vars */
const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const ApiError = require("../Utils/ApiError");
delete require.cache[require.resolve("../Config/config")];
const config = require("../Config/config");
const { Admin } = require("../Models/admin.model");
const { roleRights } = require("../Config/role");
// const JWT_SECRET = "secret123456789"
const requireSignin = (req, res, next) => {
	try {
		if (req.headers.authorization) {
			const token = req.headers.authorization.split(" ")[1];

			const user = jwt.verify(token, config.jwt.secret);
			req.user = user;
			// } else {
			// 	throw new ApiError(httpStatus.BAD_REQUEST, "Authorization Required");
			// }
		}
	} catch (error) {
		console.log(error);
	}
	next();
};

const authMiddleware = (roles) => {
	return (req, res, next) => {
		if (!req.user) {
			throw new ApiError(
				httpStatus.BAD_REQUEST,
				"Authorization Required",
			);
		}

		if (!roles.includes(req.user.role)) {
			throw new ApiError(
				httpStatus.BAD_REQUEST,
				"You have no access rights",
			);
		}

		next();
	};
};

// Usage:
const adminAuthMiddleware = authMiddleware(["admin"]);
const dealerAuthMiddleware = authMiddleware(["dealer"]);

const restrict = (...requiredRights) => {
	return (req, res, next) => {
		if (requiredRights.length) {
			const userRights = roleRights.get(req.user.role);
			const hasRequiredRights = requiredRights.every((requiredRight) =>
				userRights.includes(requiredRight),
			);
			if (!hasRequiredRights && req.params.userId !== req.user._id) {
				throw new ApiError(httpStatus.UNAUTHORIZED, "Forbidden");
			}
		}
		next();
	};
};

module.exports = {
	requireSignin,
	adminAuthMiddleware,
	dealerAuthMiddleware,
	restrict,
};
