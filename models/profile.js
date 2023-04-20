const mongoose = require("mongoose");
const Joi = require("joi");

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 2, maxlength: 30 },
    dob: { type: String, required: true, minlength: 1, maxlength: 100 },
    gender: { type: String, required: true },
    bloodgrp: { type: String, required: true },
    address: { type: String, required: true },
    medicalhistory: { type: String, required: true },
    allergies: { type: String, minlength: 2, maxlength: 1024 },
    emergencyContact: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    phoneno: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /\d{10}/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model(
  "ProfileModel",
  profileSchema,
  "mediAI-profiles"
);

const validateProfile = (profile) => {
  const profileSchema = Joi.object({
    name: Joi.string().min(2).max(30).required(),
    dob: Joi.string().min(1).max(100).required(),
    gender: Joi.string().required(),
    bloodgrp: Joi.string().required(),
    address: Joi.string().required(),
    medicalhistory: Joi.string().required(),
    allergies: Joi.string().min(2).max(1024),
    emergencyContact: Joi.string().min(2).max(30).required(),
    phoneno: Joi.string().pattern(new RegExp("^\\d{10}$")).required(),
  });

  return profileSchema.validate(profile);
};

exports.ProfileModel = Profile;
exports.validateProfile = validateProfile;
