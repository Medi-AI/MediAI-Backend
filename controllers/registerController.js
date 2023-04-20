const { CustomErrorHandler } = require("../services");
const { User, validateUser } = require("../models/User");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

const RegisterController = {
  async register(req, res, next) {
    console.log(req.body);
    const { error } = validateUser(req.body);
    if (error) return next(error);

    let user = await User.findOne({ email: req.body.email });
    if (user)
      return next(
        CustomErrorHandler.alreadyExists("This email is already exists")
      );

    user = await User.findOne({ username: req.body.username });
    if (user)
      return next(
        CustomErrorHandler.alreadyExists("This username is already exists")
      );

    user = new User(
      _.pick(req.body, ["name", "email", "username", "password", "RegisterAs"])
    );
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    if (!user) {
      return next(new CustomErrorHandler(402, "User not saved!"));
    }

    const token = await user.generateAuthToken();

    console.log(token);

    res
      .status(200)
      .header("mediai-auth-token", token)
      .send({ message: "Registeration Successful", name: user.name });
  },
};

module.exports = RegisterController;
