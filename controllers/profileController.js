const _ = require("lodash");
const { ProfileModel, validateProfile } = require("../models/profile");
const { User } = require("../models/User");
const { CustomErrorHandler } = require("../services");

const ProfileController = {
  async profile(req, res, next) {
    const inputProfile = _.pick(req.body, [
      "name",
      "dob",
      "gender",
      "bloodgrp",
      "phoneno",
      "emergencyContact",
      "address",
      "medicalhistory",
      "allergies",
    ]);

    const { error } = validateProfile(inputProfile);
    if (error) return next(error);

    profile = new ProfileModel(inputProfile);
    await profile.save();

    await User.findByIdAndUpdate(
      req.body.user_id,
      { profileID: profile._id },
      { new: true }
    );

    if (!profile) {
      return next(new CustomErrorHandler(402, "Profile not saved!"));
    }

    res.status(200).json({ message: "Profile Saved", profile: profile });
  },
};

module.exports = ProfileController;
