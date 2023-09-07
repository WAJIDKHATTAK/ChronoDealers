const express = require("express");
const router = express.Router();
const adminRoute = require("./admin.route");
const dealerRoute = require("./dealer.route");
const watchRoute = require("./watch.route");
const defaultRoutes = [
	{
		path: "/admin",
		route: adminRoute,
	},
	{
		path: "/dealer",
		route: dealerRoute,
	},
	{
		path: "/watch",
		route: watchRoute,
	},
];
defaultRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

module.exports = router;
