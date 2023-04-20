const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { jwtPrivateKey } = require("../config");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 50 },
    username: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 20,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      minlength: 5,
      maxlength: 255,
    },
    password: { type: String, required: true, minlength: 5, maxlength: 1024 },
    RegisterAs: { type: String, default: "Patient", required: true },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    jwtPrivateKey
  );
  return token;
};

const User = mongoose.model("User", userSchema, "mediAI-users");

const validateUser = (user) => {
  const userSchema = Joi.object({
    name: Joi.string().required().min(3).max(50),
    username: Joi.string().min(4).max(20).required(),
    email: Joi.string().required().min(5).max(255).email(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9@._!#-]+$"))
      .min(5)
      .max(1024)
      .required(),
    repeat_password: Joi.ref("password"),
    RegisterAs: Joi.string().required(),
  });

  return userSchema.validate(user);
};

exports.User = User;
exports.validateUser = validateUser;
