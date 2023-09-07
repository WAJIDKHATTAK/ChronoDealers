const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

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
		dealerId: Joi.required().custom(objectId),
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

const forgotPassword = {
	body: Joi.object().keys({
		email: Joi.string().email().required(),
	}),
};

// const changePassword = {
// 	body: Joi.object().keys({
// 		email: Joi.string().email().required(),
// 		oldPassword: Joi.string().required(),
// 		newPassword: Joi.string().required(),
// 	}),
// };

const resetPassword = {
	params: Joi.object().keys({
		resetLink: Joi.string().required(),
	}),
	body: Joi.object().keys({
		newPassword: Joi.string().required().custom(password),
	}),
};

// const resetPasswordviaEmail = {
// 	body: Joi.object().keys({
// 		email: Joi.string().required(),
// 		newPassword: Joi.string().required().custom(password),
// 		// oldPassword: Joi.string().required().custom(password),
// 	}),
// };
const post_Watch = {
	params: Joi.object().keys({
		dealerId: Joi.required().custom(objectId),
	}),
	body: Joi.object().keys({
		brandName: Joi.string().required(),
		dialColor: Joi.string().required(),
		caseMaterial: Joi.string().required(),
		braceletMaterial: Joi.string().required(),
		caseDiameter: Joi.number().required(),
		yearOfProduction: Joi.number().required(),
		location: Joi.string().required(),
		crystal: Joi.string().required(),
		price: Joi.number().required(),
		description: Joi.string().required(),
		image: Joi.string(),
		document: Joi.string(),
	}),
};

const allDealersAndWatches = {
	params: Joi.object().keys({
		dealerId: Joi.required().custom(objectId),
	}),
};
module.exports = {
	register,
	login,
	// logout,
	updatePassword,
	// queryUsers,
	// getUser,
	forgotPassword,
	// changePassword,
	resetPassword,
	// resetPasswordviaEmail,
	post_Watch,
	allDealersAndWatches,
};
