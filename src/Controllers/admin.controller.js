const adminService = require("../Services/admin.service");
const httpStatus = require("http-status");
const ApiError = require("../Utils/ApiError");

const registerAdmin = async (req, res) => {
	try {
		const adminBody = req.body;
		const admin = await adminService.register(adminBody);
		res.status(httpStatus.CREATED).json(admin);
	} catch (error) {
		console.log(error);
		throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
	}
};
const loginAdmin = async (req, res) => {
	try {
		const adminBody = req.body;
		const result = await adminService.login(adminBody);
		res.status(httpStatus.OK).json(result);
	} catch (error) {
		const myerror = new ApiError(httpStatus.UNAUTHORIZED, error);
		res.status(myerror.statusCode).json(myerror);
	}
};
const updateAdminPassword = async (req, res) => {
	try {
		const { adminId } = req.params;
		const adminBody = req.body;
		const updatedAdmin = await adminService.updatePassword(
			adminId,
			adminBody,
		);
		res.status(httpStatus.OK).json(updatedAdmin);
	} catch (error) {
		const myerror = new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
		res.status(myerror.statusCode).json(myerror);
	}
};
const adminApproveWatch = async (req, res) => {
	try {
		const watchId = req.params.watchId;
		const watchBody = req.body;
		const watch = adminService.approveWatch(watchId, watchBody);
		res.status(httpStatus.OK).json(watch);
	} catch (error) {
		throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
	}
};
const AllDealers = async (req, res) => {
	try {
		const allDealers = await adminService.getAllDealers();
		res.status(httpStatus.OK).json(allDealers);
	} catch (error) {
		throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
	}
};
module.exports = {
	registerAdmin,
	loginAdmin,
	updateAdminPassword,
	adminApproveWatch,
	AllDealers,
};
