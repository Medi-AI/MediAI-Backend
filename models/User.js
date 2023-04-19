const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		name: {type: String, required: true},
		username: {type: String, required: true},
		email: {type: String, required: true, unique: true},
		password: {type: String, required: true},
		RegisterAs: {type: String, default: "Patient"},
	},
	{timestamps: true},
);

module.exports = mongoose.model("User", userSchema, "mediAI-users");
