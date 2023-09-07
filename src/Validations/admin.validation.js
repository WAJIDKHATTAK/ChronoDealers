const Joi = require("joi");
const { objectId } = require("./custom.validation");

const register = {
	body: Joi.object().keys({
		firstName: Joi.string().required(),
		lastName: Joi.string().required(),
		email: Joi.string().email().required(),
		password: Joi.string().min(8).max(32).required(),
	}),
};

const login = {
	body: Joi.object().keys({
		email: Joi.string().email().required(),
		password: Joi.string().min(8).max(32).required(),
	}),
};

// const logout = {
// 	body: Joi.object().keys({
// 		refreshToken: Joi.string().required(),
// 	}),
// };

const updatePassword = {
	params: Joi.object().keys({
		adminId: Joi.required().custom(objectId),
	}),
	body: Joi.object().keys({
		password: Joi.string().min(8).max(32).required(),
		newPassword: Joi.string().min(8).max(32).required(),
		confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
	}),
};

// const queryUsers = {
// 	query: Joi.object().keys({
// 		limit: Joi.number().integer(),
// 		page: Joi.number().integer(),
// 	}),
// };

// const getUser = {
// 	params: Joi.object().keys({
// 		userId: Joi.string().custom(objectId),
// 	}),
// };

// const forgotPassword = {
// 	body: Joi.object().keys({
// 		email: Joi.string().email().required(),
// 	}),
// };

// const changePassword = {
// 	body: Joi.object().keys({
// 		email: Joi.string().email().required(),
// 		oldPassword: Joi.string().required(),
// 		newPassword: Joi.string().required(),
// 	}),
// };

// const resetPassword = {
// 	query: Joi.object().keys({
// 		token: Joi.string().required(),
// 	}),
// 	body: Joi.object().keys({
// 		password: Joi.string().required().custom(password),
// 	}),
// };

// const resetPasswordviaEmail = {
// 	body: Joi.object().keys({
// 		email: Joi.string().required(),
// 		newPassword: Joi.string().required().custom(password),
// 		// oldPassword: Joi.string().required().custom(password),
// 	}),
// };

const admin_approve = {
	params: Joi.object().keys({
		watchId: Joi.required().custom(objectId),
	}),
	body: Joi.object().keys({
		status: Joi.string().required(),
		comments: Joi.string(),
	}),
};
module.exports = {
	register,
	login,
	// logout,
	updatePassword,
	// queryUsers,
	// getUser,
	// forgotPassword,
	// changePassword,
	// resetPassword,
	// resetPasswordviaEmail,
	admin_approve,
};
