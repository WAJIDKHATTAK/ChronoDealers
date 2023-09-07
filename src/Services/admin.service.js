const httpStatus = require("http-status");
const Admin = require("../Models/admin.model");
const Watch = require("../Models/watch.model");
const bcrypt = require("bcryptjs");
const ApiError = require("../Utils/ApiError");
const generateJwtToken = require("../Config/generateToken");
const Dealer = require("../Models/dealer.model");

const register = async (adminBody) => {
	if (await Admin.isEmailTaken(adminBody.email)) {
		throw new ApiError(httpStatus.BAD_REQUEST, "Admin Already Exists..");
	}
	return await Admin.create(adminBody);
};
const login = async (adminBody) => {
	try {
		const admin = await Admin.findOne({ email: adminBody.email });
		if (!admin) {
			throw new ApiError(httpStatus.BAD_REQUEST, "Credentials Invalid");
		}
		const checkPassword = await admin.isPasswordMatch(adminBody.password);
		if (!checkPassword) {
			throw new ApiError(httpStatus.BAD_REQUEST, "Credentials Invalid");
		}
		const token = generateJwtToken(admin._id, "admin");
		const result = { token, admin };
		return result;
	} catch (error) {
		throw new ApiError(httpStatus.UNAUTHORIZED, error);
	}
};
const updatePassword = async (adminId, adminBody) => {
	try {
		const admin = await Admin.findOne({ _id: adminId });
		if (!admin) {
			throw new ApiError(httpStatus.BAD_REQUEST, "No User Found");
		}
		const checkPassword = await admin.isPasswordMatch(adminBody.password);
		if (!checkPassword) {
			throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Password");
		}

		const hashPassword = await bcrypt.hash(adminBody.newPassword, 10);
		const updateAdmin = await Admin.findOneAndUpdate(
			{ _id: adminId },
			{ $set: { password: hashPassword } },
			{ new: true },
		);
		return updateAdmin;
	} catch (error) {
		throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
	}
};
const approveWatch = async (watchId, watchBody) => {
	try {
		console.log("Received watchId:", watchId);
		const watch = await Watch.findOneAndUpdate(
			{ _id: watchId },
			{
				$set: {
					status: watchBody.status,
					comments: watchBody.comments,
				},
			},
			{ new: true },
		);
		if (!watch) {
			throw new ApiError(httpStatus.BAD_REQUEST, "Wrong Id!");
		}
		return watch;
	} catch (error) {
		throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
	}
};
const getAllDealers = async () => {
	try {
		const dealers = await Dealer.find().limit(12);
		// console.log(dealers);
		return dealers;
	} catch (error) {
		throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
	}
};
module.exports = {
	register,
	login,
	updatePassword,
	approveWatch,
	getAllDealers,
};
