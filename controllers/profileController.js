const Joi = require("joi");

const ProfileController = {
	profile(req, res, next) {
		console.log(req.body);
		//Validation using Joi
		const profileSchema = Joi.object({
			username: Joi.string().min(2).max(30).required(),
			dob: Joi.string().min(1).max(100).required(),
			gender: Joi.string().required(),
			bloodgrp: Joi.string().required(),
			phoneno: Joi.string().required(),
			emergencyContact: Joi.string().required(),
			address: Joi.string().required(),
			medicalhistory: Joi.string().required(),
			allergies: Joi.string(),
		});

		const {error} = profileSchema.validate(req.body);
		if (error) {
			return next(error);
		}
	},
};

module.exports = ProfileController;
