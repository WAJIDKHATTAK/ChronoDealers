const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { toJSON, paginate } = require("./plugins");
const mongoDuplicateKeyError = require("../Utils/mongoDuplicateKeyError");

const dealerSchema = mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
		},
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		mobileNumber: {
			type: String,
		},
		myWatch: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "Watch", // Replace 'Dealer' with the actual name of your dealer model
		},
		role: {
			type: String,
			enum: ["admin", "dealer"],
			default: "dealer",
		},
		profilePicture: {
			type: String,
		},
	},
	{ timestamps: true },
);
// add plugin that converts mongoose to json
dealerSchema.plugin(toJSON);
dealerSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
dealerSchema.statics.isEmailTaken = async function (email, excludeUserId) {
	const admin = await this.findOne({ email, _id: { $ne: excludeUserId } });
	return !!admin;
};
/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
dealerSchema.methods.isPasswordMatch = async function (password) {
	const user = this;
	return bcrypt.compare(password, user.password);
};

dealerSchema.pre("save", async function (next) {
	const user = this;
	if (user.isModified("password")) {
		user.password = await bcrypt.hash(user.password, 10);
	}
	next();
});

mongoDuplicateKeyError(dealerSchema);
/**
 * @typedef Admin
 */
const Dealer = mongoose.model("Dealer", dealerSchema);

module.exports = Dealer;
