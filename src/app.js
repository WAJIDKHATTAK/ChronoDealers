/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
//! Packages
const express = require("express");
const app = express();
const path = require("path");
//? Collection of middleware function Each sets a specific HTTP header
const helmet = require("helmet");
//? Protecs XSS attacks by filtering and cleaning user input
const xss = require("xss-clean");
//? sanitize user input to prevent NoSQL Injection attacks
const mongoSanitize = require("express-mongo-sanitize");
//? reduce the size of responses sent from your server to the client
const compression = require("compression");
//? Enables cross-origin requests adds necessary cors headers in res
const cors = require("cors");
//? Provides collection of standard HTTP status codes and related utility functions
const httpStatus = require("http-status");
//! Custom Configs
require("dotenv").config();
const config = require("./Config/config");
const morgan = require("./Config/morgan");
const logger = require("./Config/logger");
//! Custom MiddleWares
const { authLimiter } = require("./Middlewares/rateLimiter");
const logRequest = require("./Middlewares/logRequests");
const {
	errorConverter,
	errorHandler,
	customErrorMessage,
} = require("./Middlewares/error");
//? Routes
const routes = require("./Routes");
//! Utilities
const ApiError = require("./Utils/ApiError");

if (config.env !== "test") {
	app.use(morgan.successHandler);
	app.use(morgan.errorHandler);
}
//? set security Http Headers
app.use(helmet());

//? parse json REQUEST BODY
app.use(express.json());
app.use(express.urlencoded({ limit: "500mb", extended: true }));

//? parse URLEncoded REQUEST BODY
app.use(express.urlencoded({ extended: true }));

//! sanitize request data
app.use(xss());
app.use(mongoSanitize());

//? gzip compression
app.use(compression());

//? Enable Cors
app.use(cors());
app.options("*", cors());

//! Setting up view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Templates")); // Specify the directory where your EJS templates are located

// TODO set Policy
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

//! limit repeated failed requests to auth endpoints
if (config.env === "production") {
	app.use("/auth", authLimiter);
}
app.use(express.static("public"));
app.use(logRequest);

//? Routes
// app.get("/upload-watch", (req, res) => {
// 	res.render("watch"); // Assuming your EJS file is named "watch-form.ejs"
//   });

// app.get("/test-jwt-secret", (req, res) => {
// 	res.send(`JWT_SECRET: ${config.jwt.secret}`);
// });

app.use(routes);
//TODO send Back an 404 error for any unknown api request
app.use((req, res, next) => {
	next(new ApiError(httpStatus.BAD_REQUEST, "API NOT FOUND"));
});

//? convert error to ApiError, if needed
app.use(errorConverter);
app.use(customErrorMessage);
//TODO handle error
app.use(errorHandler);

module.exports = app;
