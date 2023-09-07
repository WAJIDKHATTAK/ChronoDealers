const mongoose = require("mongoose");
const { tokenTypes } = require("../Config/tokens");
const { roles } = require("../Config/role");

const tokenSchema = mongoose.Schema(
	{
		token: {
			type: String,
			required: true,
			index: true,
		},
		uid: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD],
			required: true,
		},
		user: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "Dealer", // Replace 'Dealer' with the actual name of your dealer model
			required: true,
		},
		role: {
			type: String,
			enum: roles, // Define the possible roles
		},
		expires: {
			type: Date,
			required: true,
		},
		blacklisted: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
);

/**
 * @typedef Token
 */
const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
