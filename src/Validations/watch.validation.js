const Joi = require("joi");
const { objectId } = require("./custom.validation");
const watchDetailed = {
	params: Joi.object().keys({
		watchId: Joi.required().custom(objectId),
	}),
};

module.exports = {
	watchDetailed,
};
