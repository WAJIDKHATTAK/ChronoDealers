const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const mongoDuplicateKeyError = require("../Utils/mongoDuplicateKeyError");

const watchSchema = mongoose.Schema(
	{
		brandName: {
			type: String,
			required: true,
		},
		dialColor: {
			type: String,
			required: true,
		},
		model: {
			type: String,
			required: true,
		},
		caseMaterial: {
			type: String,
			required: true,
		},
		braceletMaterial: {
			type: String,
			required: true,
		},
		caseDiameter: {
			type: Number,
			required: true,
		},
		yearOfProduction: {
			type: Number,
			required: true,
		},
		location: {
			type: String,
			required: true,
		},
		crystal: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		image: [
			{
				type: String,
			},
		],
		document: {
			type: String,
			default: {},
		},
		comments: {
			type: String,
		},
		dealerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Dealer", // This should match the name of your dealer model
			required: true,
		},
		status: {
			type: String,
			enum: ["pending", "approved", "rejected"],
			default: "pending",
		},
	},
	{
		timestamps: true,
	},
);

watchSchema.plugin(toJSON);
watchSchema.plugin(paginate);
mongoDuplicateKeyError(watchSchema);

const Watch = mongoose.model("Watch", watchSchema);

module.exports = Watch;
