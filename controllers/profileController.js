const _ = require("lodash");
const { ProfileModel, validateProfile } = require("../models/profile");
const { CustomErrorHandler } = require("../services");

const ProfileController = {
  async profile(req, res, next) {
    const { error } = validateProfile(req.body);
    if (error) return next(error);

    let profile = await ProfileModel.findOne({ username: req.body.username });
    if (profile)
      return next(
        CustomErrorHandler.alreadyExists("This username is already exists")
      );

    profile = new ProfileModel(
      _.pick(req.body, [
        "name",
        "dob",
        "gender",
        "bloodgrp",
        "phoneno",
        "emergencyContact",
        "address",
        "medicalhistory",
        "allergies",
      ])
    );
    await profile.save();

    if (!profile) {
      return next(new CustomErrorHandler(402, "Profile not saved!"));
    }

    res.status(200).json({ message: "Profile Saved" });
  },
};

module.exports = ProfileController;
