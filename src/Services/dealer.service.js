const Dealer = require("../Models/dealer.model");
// const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const bcrypt = require("bcryptjs");
const ApiError = require("../Utils/ApiError");
const nodemailer = require("nodemailer");
const Watch = require("../Models/watch.model");
const mongoose = require("mongoose");
// const uuid = require("uuid");

// const resetLinks = {};
const transporter = nodemailer.createTransport({
	service: "Gmail",
	auth: {
		user: "wkhattak44@gmail.com",
		pass: "efnnkrhkqcwoctre",
	},
});
const register = async (dealerBody) => {
	if (await Dealer.isEmailTaken(dealerBody.email)) {
		throw new ApiError(httpStatus.BAD_REQUEST, "dealer Already Exists..");
	}
	return await Dealer.create(dealerBody);
};
const login = async (dealerBody) => {
	try {
		console.log("service", dealerBody);
		const dealer = await Dealer.findOne({ email: dealerBody.email });
		if (!dealer) {
			throw new ApiError(httpStatus.BAD_REQUEST, "Credentials Invalid");
		}
		const checkPassword = await dealer.isPasswordMatch(dealerBody.password);
		console.log(checkPassword);
		if (!checkPassword) {
			throw new ApiError(httpStatus.BAD_REQUEST, "Credentials Invalid");
		}
		return dealer;
	} catch (error) {
		console.log(error);
	}
};
const updatePassword = async (dealerId, dealerBody) => {
	try {
		const dealer = await Dealer.findOne({ _id: dealerId });
		if (!dealer) {
			throw new ApiError(httpStatus.BAD_REQUEST, "No User Found");
		}
		const checkPassword = await dealer.isPasswordMatch(dealerBody.password);
		if (!checkPassword) {
			throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Password");
		}

		const hashPassword = await bcrypt.hash(dealerBody.newPassword, 10);
		const updateDealer = await Dealer.findOneAndUpdate(
			{ _id: dealerId },
			{ $set: { password: hashPassword } },
			{ new: true },
		);
		return updateDealer;
	} catch (error) {
		throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
	}
};
const forgotPassword = async (dealerBody) => {
	try {
		const oldDealer = await Dealer.findOne({ email: dealerBody.email });
		if (!oldDealer) {
			throw new ApiError(httpStatus.NOT_FOUND, "User Does Not Exists!");
		}
		const resetLink = `http://localhost:3000/dealer/reset_password/resetLink/${oldDealer._id}`;

		const mailOptions = {
			from: "wkhattak44@gmail.com",
			to: "wayne.kerr@eliteitteam.com",
			subject: "Password Reset",
			text: `Click the following link to reset your password: ${resetLink}`,
			html: `<a href ="${resetLink}>Reset Password</a>`,
		};

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log("Email send : " + info.response);
			}
		});
		return resetLink;
	} catch (error) {
		throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
	}
};
const resetPassword = async (resetLink, newPassword) => {
	try {
		const checkresetLink = await Dealer.findOne({ _id: resetLink });
		console.log(checkresetLink);
		if (!checkresetLink) {
			throw new ApiError(httpStatus[401], "Not Authorized..");
		}
		const hashPassword = await bcrypt.hash(newPassword, 10);
		checkresetLink.password = hashPassword;
		await checkresetLink.save();
		console.log("Password updated successfully");
	} catch (error) {
		throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
	}
};
const dealerPostWatch = async (dealerId, watchBody) => {
	try {
		const dealer = await Dealer.findById(dealerId);
		if (!dealer) {
			throw new ApiError(httpStatus.BAD_REQUEST, "Dealer Not Found");
		}
		const { images, ...watchData } = watchBody;
		console.log(watchBody);
		return await Watch.create({
			dealerId: dealerId,
			...watchData,
			image: images,
		});
	} catch (error) {
		throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
	}
};
const dealerAndHisWatches = async (dealerId) => {
	try {
		const dealerIdObject = new mongoose.Types.ObjectId(dealerId);

		const dealer = await Dealer.aggregate([
			{
				$match: { _id: dealerIdObject }, // Match the dealer by _id
			},
			{
				$addFields: {
					DealerName: { $concat: ["$firstName", " ", "$lastName"] },
				},
			},
			{
				$project: {
					_id: 0,
					password: 0,
					updatedAt: 0,
					createdAt: 0, // Exclude the updatedAt field
					firstName: 0,
					lastName: 0,
					__v: 0, // Exclude the __v field
				},
			},
		]);
		const dealersWatch = await Watch.find({ dealerId: dealerId });

		const details = { dealersWatch, dealer };
		console.log(details);
	} catch (error) {
		throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
	}
};
module.exports = {
	register,
	login,
	updatePassword,
	forgotPassword,
	resetPassword,
	dealerPostWatch,
	dealerAndHisWatches,
};

// const resetLink = uuid.v4();
// 	resetLinks[resetLink] = {
// 		email,
// 		expires: Date.now() + 3600000,
// 	};
// 	const resetPasswordLink = `${emailConfig.resetBaseUrl}/${resetLink}`;
// 	const mailOptions = {
// 		from: emailConfig.from,
// 		to: email,
// 		subject: "Reset Password",
// 		text: `Click the link below to reset your password:\n${resetPasswordLink}`,
// 		html: `<a href="${resetPasswordLink}">Reset Password</a>`,
// 	};
// 	await transporter.sendMail(mailOptions);
// };

// const resetPassword = async (resetLink, newPassword) => {
// 	const resetInfo = resetLinks[resetLink];
// 	if (!resetInfo || Date.now() > resetInfo.expires) {
// 		throw new Error("Invalid or expired reset link");
// 	}
// 	// Simulate updating the user's password in the database
// 	// Replace with your actual database update
// 	const updatedUser = await Dealer.updatePassword(
// 		resetInfo.email,
// 		newPassword,
// 	);
// 	if (!updatedUser) {
// 		throw new Error("Password update failed");
// 	}
// 	delete resetLinks[resetLink];
// };
// try {
// 	const oldUser = await Dealer.findOne({ email: dealerBody.email });
// 	if (!oldUser) {
// 		throw new ApiError(httpStatus.NOT_FOUND, "User Does Not Exists!");
// 	}
// 	const secret = config.jwt.secret + oldUser.password;
// 	const resetPasswordToken = jwt.sign(
// 		{
// 			email: oldUser.email,
// 			id: oldUser._id,
// 			type: tokenTypes.RESET_PASSWORD,
// 		},
// 		secret,
// 		{ expiresIn: "20m" },
// 	);
// 	console.log(resetPasswordToken)
// 	const dealerToken = await Token.findbyidAndUpdate(
// 		{user: oldUser._id },
// 		{
// 			$set :{
// 		token : resetPasswordToken,
// 		type : tokenTypes.RESET_PASSWORD,
// 		expires : resetPasswordToken.expiresIn,
// 		createdAt: new Date() , updatedAt: new Date() },
// 		},
// 		{
// 			new: true,
// 		}
// 		);
//     // console.log(dealerToken);
// 	return resetPasswordToken;
// } catch (error) {
// 	console.log(error, "User Not Found");
// }
