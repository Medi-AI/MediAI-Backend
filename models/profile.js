const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const profileSchema = new Schema(
	{
		username: {type: String, required: true, unique: true},
		dob: {type: String, required: true},

		gender: {type: String, required: true},
		bloodgrp: {type: String, required: true},
		address: {type: String, required: true},
		medicalhistory: {type: String, required: true},
		allergies: {type: String, required: true},
		emergencyContact: {type: String, required: true},
		phoneno: {type: String, required: true},
	},
	{timestamps: true},
);

module.exports = mongoose.model(
	"ProfileModel",
	profileSchema,
	"mediAI-profiles",
);
