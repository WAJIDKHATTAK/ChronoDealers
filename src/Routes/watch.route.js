const express = require("express");
const router = express.Router();
const validate = require("../Middlewares/validate");
const watchController = require("../Controllers/watch.controller");
const watchValidation = require("../Validations/watch.validation");

router.get(
	"/get_watch_detail/watchId/:watchId",
	validate(watchValidation.watchDetailed),
	watchController.watchDetailed,
);

router.get("/query_watches", watchController.filteredWatches);
router.get("/recent_watches", watchController.recentlyAdded);
module.exports = router;
