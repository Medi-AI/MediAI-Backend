const {ValidationError} = require("joi");
const {CustomErrorHandler} = require("../services");

const errorHandler = (error, req, res, next) => {
	console.log("inside error middleware");
	console.log(error);
	let statusCode = 500;
	let data = {
		message: "Internal Server Error",
	};

	if (error instanceof ValidationError) {
		statusCode = 422;
		data = {
			message: error.message,
		};
	}

	if (error instanceof CustomErrorHandler) {
		statusCode = error.status;
		data = {
			message: error.message,
		};
	}

	return res.status(statusCode).json(data);
};

module.exports = errorHandler;
