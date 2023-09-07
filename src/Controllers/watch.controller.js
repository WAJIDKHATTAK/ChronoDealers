const httpStatus = require("http-status");
const ApiError = require("../Utils/ApiError");
const watchService = require("../Services/watch.service");

const watchDetailed = async (req, res) => {
	try {
		const { watchDetails, relatedWatches } =
			await watchService.watchDetails(req.params.watchId);
		const response = { watchDetails, relatedWatches };

		// Send the response as JSON
		res.status(httpStatus.OK).json(response);
	} catch (error) {
		throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
	}
};

const filteredWatches = async (req, res) => {
	const {
		minPrice,
		maxPrice,
		brandName,
		model,
		caseDiameter,
		dialColor,
		caseMaterial,
		page = 1,
		limit = 10,
	} = req.query;

	try {
		const result = await watchService.getFilteredWatches({
			minPrice,
			maxPrice,
			brandName,
			model,
			caseDiameter,
			dialColor,
			caseMaterial,
			page,
			limit,
		});
		res.status(httpStatus.CREATED).json(result);
	} catch (error) {
		throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
	}
};
const recentlyAdded = async (req, res) => {
	try {
		const recentWatches = await watchService.recentlyAddedWatches();
		res.status(httpStatus.OK).json(recentWatches);
	} catch (error) {
		throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
	}
};
module.exports = {
	watchDetailed,
	filteredWatches,
	recentlyAdded,
};
