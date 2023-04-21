const Joi = require("joi");
const bcrypt = require("bcryptjs");

const { User } = require("../models/User");
const { ProfileModel } = require("../models/profile");
const { CustomErrorHandler } = require("../services");

const LoginController = {
  async login(req, res, next) {
    const loginSchema = Joi.object({
      email: Joi.string().required().min(5).max(255).email(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9@._!#-]+$"))
        .min(5)
        .max(1024)
        .required(),
    });

    const { error } = loginSchema.validate(req.body);

    if (error) return next(error);

    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(
        CustomErrorHandler.wrongCredentials(
          "You haven't registerd.. signup first."
        )
      );
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword)
      return next(CustomErrorHandler.wrongCredentials("Wrong Password"));

    const profile = await ProfileModel.findOne({ _id: user.profileID });

    const token = await user.generateAuthToken();

    res
      .status(200)
      .header("mediai-auth-token", token)
      .json({ message: "Login Successful", user: user, profile: profile });
  },

  async logout(req, res, next) {
    // validation
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });

    const { error } = refreshSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    try {
      await RefreshToken.deleteOne({
        token: req.body.refresh_token,
      });
    } catch (error) {
      return next(new Error("Something went wrong in the database"));
    }

    res.json({ code: "Okay" });
  },
};

module.exports = LoginController;
