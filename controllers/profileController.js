const Joi = require("joi");

const ProfileController = {
	profile(req, res, next) {
		console.log(req.body);
		//Validation using Joi
		const profileSchema = Joi.object({
			username: Joi.string().min(2).max(30).required(),
			age: Joi.number().min(1).max(100).required(),
			gender: Joi.Gender().required(),
			bloodgrp: Joi.string().required(),
			address: Joi.string().required(),
			medicalhistory: Joi.string().required(),
			allergies: Joi.string(),
			emergencyContact: Joi.number().required(),
		});

		const {error} = profileSchema.validate(req.body);
		if (error) {
			return next(error);
		}
	},
};

module.exports = ProfileController;
