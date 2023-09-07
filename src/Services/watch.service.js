const Watch = require("../Models/watch.model");
const httpStatus = require("http-status");
const ApiError = require("../Utils/ApiError");

const watchDetails = async (watchId) => {
	try {
		// const {WatchId} = watchId;
		const watchDetails = await Watch.findOne({ _id: watchId });
		const relatedWatches = await Watch.find({
			status: "approved",
			_id: { $nin: [watchDetails._id] }, // Exclude the current watch _id
			$or: [
				{ brandName: watchDetails.brandName },
				{ yearOfProduction: watchDetails.yearOfProduction },
				{ caseDiameter: watchDetails.caseDiameter },
			],
		}).limit(4);
		console.log("related : ", relatedWatches);
		return { watchDetails, relatedWatches };
	} catch (error) {
		throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
	}
};

const getFilteredWatches = async (filters) => {
	/**
	 * Explore by query
	 * price
	 * Brand Discover more leads to search by brand
	 * Model
	 * CaseSize
	 * Gender
	 * Case Material
	 * Dial Color
	 *
	 */
	const options = {
		page: filters.page,
		limit: filters.limit,
		sortBy: "createdAt:desc",
	};

	const filter = {
		status: { $eq: "approved" },
	};

	if (filters.minPrice & filters.maxPrice) {
		filter.price = { $gte: filters.minPrice, $lte: filters.maxPrice };
	}
	if (filters.brandName) {
		filter.brandName = filters.brandName;
	}
	if (filters.model) {
		filter.model = filters.model;
	}
	if (filters.caseDiameter) {
		filter.caseDiameter = filters.caseDiameter;
	}
	if (filters.dialColor) {
		filter.dialColor = filters.dialColor;
	}
	if (filters.caseMaterial) {
		filter.caseMaterial = filters.caseMaterial;
	}

	try {
		const result = await Watch.paginate(filter, options);
		return result;
	} catch (error) {
		throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
	}
};
// const popularCategories = async () => {
// };

const recentlyAddedWatches = async () => {
	try {
		const recentWatches = await Watch.find({ status: "approved" })
			.sort({
				createdAt: -1,
			})
			.limit(4);
		return recentWatches;
	} catch (error) {
		throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
	}
};

module.exports = {
	watchDetails,
	getFilteredWatches,
	recentlyAddedWatches,
};
