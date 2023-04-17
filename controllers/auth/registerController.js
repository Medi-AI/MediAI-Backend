const {CustomErrorHandler} = require("../../services");
const {User} = require("../../models");

//Username : parthsali04
// Password : UeALgNJObnvVAffH

// mongo url :

const Joi = require("joi");
const RegisterController = {
	async register(req, res, next) {
		console.log(req.body);
		const registerSchema = Joi.object({
			name: Joi.string().min(2).max(30).required(),
			email: Joi.string().email().required(),
			password: Joi.string()
				.pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
				.required(),
			repeat_password: Joi.ref("password"),
		});

		const {error} = registerSchema.validate(req.body);

		if (error) {
			return next(error);
		}

		try {
			const exists = await User.exists({
				email: req.body.email,
			});

			if (exists) {
				return next(
					CustomErrorHandler.alreadyExists(
						"This email is already exists",
					),
				);
			}
		} catch (error) {
			return next(error);
		}

		const {name, email, password} = req.body;

		const user = new User({
			name,
			email,
			password,
		});

		const result = await user.save();
		if (!result) {
			return next(
				new CustomErrorHandler(402, "User not saved!"),
			);
		}

		res.status(200).json({message: "Register Successful"});
	},
};

module.exports = RegisterController;
