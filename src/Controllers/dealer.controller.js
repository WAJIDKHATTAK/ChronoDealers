const dealerService = require("../Services/dealer.service");
const tokenService = require("../Services/token.service");
const httpStatus = require("http-status");
const ApiError = require("../Utils/ApiError");

const registerDealer = async (req, res) => {
	try {
		const dealerBody = req.body;
		const dealer = await dealerService.register(dealerBody);
		const tokens = await tokenService.generateAuthTokens(dealer);
		res.status(httpStatus.CREATED).send({ dealer, tokens });
	} catch (error) {
		console.log(error);
		const myerror = new ApiError(httpStatus.UNAUTHORIZED, error);
		res.status(myerror.statusCode).json(myerror);
	}
};

const loginDealer = async (req, res) => {
	try {
		const dealerBody = req.body;
		const result = await dealerService.login(dealerBody);
		const tokens = await tokenService.generateAuthTokens(result);
		res.status(httpStatus.OK).send({ result, tokens });
	} catch (error) {
		const myerror = new ApiError(httpStatus.UNAUTHORIZED, error);
		res.status(myerror.statusCode).json(myerror);
	}
};

const updateDealerPassword = async (req, res) => {
	try {
		const { dealerId } = req.params;
		const dealerBody = req.body;
		const updatedDealer = await dealerService.updatePassword(
			dealerId,
			dealerBody,
		);
		res.status(httpStatus.OK).json(updatedDealer);
	} catch (error) {
		const myerror = new ApiError(httpStatus.UNAUTHORIZED, error);
		res.status(myerror.statusCode).json(myerror);
	}
};

const dealer_Forgot_Password = async (req, res) => {
	try {
		const resetPassword = await dealerService.forgotPassword(req.body);
		res.status(httpStatus.OK).json(resetPassword);
	} catch (error) {
		const myerror = new ApiError(httpStatus.UNAUTHORIZED, error);
		res.status(myerror.statusCode).json(myerror);
	}
};

const dealer_reset_password = async (req, res) => {
	try {
		const { resetLink } = req.params;
		console.log("req params : ", req.params);
		const { newPassword } = req.body;
		const resetpassword = await dealerService.resetPassword(
			resetLink,
			newPassword,
		);
		res.status(200).json(resetpassword);
	} catch (error) {
		console.log(error);
		const myerror = new ApiError(httpStatus.UNAUTHORIZED, error);
		res.status(myerror.statusCode).json(myerror);
	}
};

const postWatch = async (req, res) => {
	try {
		const dealerId = req.params.dealerId;
		const watchBody = req.body;
		const images = req.files.images;
		const document = req.files.document[0];

		const processedImages = images.map((image) => image.path);

		if (processedImages.length === 0) {
			throw new ApiError(httpStatus.BAD_REQUEST, "No images uploaded");
		}

		watchBody.images = processedImages;
		watchBody.document = document.path;

		console.log(processedImages);
		const createWatch = dealerService.dealerPostWatch(dealerId, watchBody);
		res.status(httpStatus.CREATED).json(createWatch);
	} catch (error) {
		throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
	}
};

const DealersAndWatches = async (req, res) => {
	try {
		const dealers = dealerService.dealerAndHisWatches(req.params.dealerId);
		res.status(httpStatus.CREATED).json(dealers);
	} catch (error) {
		throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
	}
};
module.exports = {
	registerDealer,
	loginDealer,
	updateDealerPassword,
	dealer_Forgot_Password,
	dealer_reset_password,
	postWatch,
	DealersAndWatches,
};
