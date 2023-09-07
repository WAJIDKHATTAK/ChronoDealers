const express = require("express");
const router = express.Router();
const { requireSignin, dealerAuthMiddleware } = require("../Middlewares/auth");
const validate = require("../Middlewares/validate");
const dealerController = require("../Controllers/dealer.controller");
const dealerValidation = require("../Validations/dealer.validation");
const upload = require("../Utils/fileUpload");

router.post(
	"/register",
	validate(dealerValidation.register),
	dealerController.registerDealer,
);

router.post(
	"/login",
	validate(dealerValidation.login),
	dealerController.loginDealer,
);
router.put(
	"/update_password/:dealerId",
	requireSignin,
	dealerAuthMiddleware,
	validate(dealerValidation.updatePassword),
	dealerController.updateDealerPassword,
);
router.post(
	"/forgot_password",
	validate(dealerValidation.forgotPassword),
	dealerController.dealer_Forgot_Password,
);
router.post(
	"/reset_password/resetLink/:resetLink",
	validate(dealerValidation.resetPassword),
	dealerController.dealer_reset_password,
);
router.post(
	"/post_watch/dealerId/:dealerId",
	upload.fields([
		{ name: "document", maxCount: 1 },
		{ name: "images", maxCount: 5 },
	]),
	validate(dealerValidation.post_Watch),
	dealerController.postWatch,
);
router.get(
	"/dealersAndWatch/dealerId/:dealerId",
	validate(dealerValidation.allDealersAndWatches),
	dealerController.DealersAndWatches,
);
module.exports = router;
