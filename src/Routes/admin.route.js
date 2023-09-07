const express = require("express");
const router = express.Router();
const {
	requireSignin,
	adminAuthMiddleware,
	restrict,
} = require("../Middlewares/auth");
const validate = require("../Middlewares/validate");
const adminController = require("../Controllers/admin.controller");
const adminValidation = require("../Validations/admin.validation");

router.post(
	"/register",
	validate(adminValidation.register),
	adminController.registerAdmin,
);

router.post(
	"/login",
	validate(adminValidation.login),
	adminController.loginAdmin,
);
router.put(
	"/update_password/:adminId",
	requireSignin,
	adminAuthMiddleware,
	validate(adminValidation.updatePassword),
	adminController.updateAdminPassword,
);
router.put(
	"/admin_approve_watch/:watchId",
	requireSignin,
	adminAuthMiddleware,
	validate(adminValidation.admin_approve),
	adminController.adminApproveWatch,
);
router.get(
	"/all_dealers",
	requireSignin,
	adminAuthMiddleware,
	restrict("getdealers"),
	adminController.AllDealers,
);
module.exports = router;
