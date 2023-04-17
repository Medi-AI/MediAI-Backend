const Joi = require("joi");
const LoginController = {
	login(req, res, next) {
		console.log(req.body);
		// validation using joi
	},
};

module.exports = LoginController;
