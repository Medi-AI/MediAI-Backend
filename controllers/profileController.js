const Joi = require("joi");
const {ProfileModel} = require("../models");

const ProfileController = {
	async profile(req, res, next) {
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

		try {
			const exists = await ProfileModel.exists({
				username: req.body.username,
			});

			if (exists) {
				return next(
					CustomErrorHandler.alreadyExists(
						"This username is already exists",
					),
				);
			}
		} catch (error) {
			return next(error);
		}

		const {
			username,
			dob,
			gender,
			bloodgrp,
			phoneno,
			emergencyContact,
			address,
			medicalhistory,
			allergies,
		} = req.body;

		const newProfile = new ProfileModel({
			username,
			dob,
			gender,
			bloodgrp,
			phoneno,
			emergencyContact,
			address,
			medicalhistory,
			allergies,
		});

		const result = await newProfile.save();

		if (!result) {
			return next(
				new CustomErrorHandler(
					402,
					"Profile not saved!",
				),
			);
		}

		res.status(200).json({message: "Profile added Successfully"});
	},
};

module.exports = ProfileController;
