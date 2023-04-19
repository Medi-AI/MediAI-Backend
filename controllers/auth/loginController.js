const Joi = require("joi");

const { User } = require("../../models");
const { CustomErrorHandler } = require("../../services");

const LoginController = {
  async login(req, res, next) {
    console.log(req.body);
    // validate requests
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
    });

    const { error } = loginSchema.validate(req.body);

    if (error) {
      console.log("Inside Error if");
      return next(error);
    }

    try {
      const user = await User.findOne({
        email: req.body.email,
      });
      if (!user) {
        return next(
          CustomErrorHandler.wrongCredentials("You haven't register signup")
        );
      }

      // compare password
      const dbpassword = await user.password; // returns 1 or 0
      // const match = user.password === req.body.password;

      if (dbpassword !== req.body.password) {
        return next(CustomErrorHandler.wrongCredentials("Wrong Password"));
      }

      //match done
      // Generate Token

      // storing in DB (DB whitelist)

      res.status(200).json({ message: "Login Successful" });
    } catch (err) {
      return next(err);
    }
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
