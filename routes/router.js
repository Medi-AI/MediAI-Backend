const express = require("express");
const router = express.Router();

const {LoginController, RegisterController} = require("../controllers");

router.get("/", (req, res) => {
	res.status(200).json({msg: "Home Page"});
});
router.post("/login", LoginController.login);
router.post("/register", RegisterController.register);

module.exports = router;
