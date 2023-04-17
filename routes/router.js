const express = require("express");
const router = express.Router();

const {LoginController, RegisterController} = require("../controllers");

router.post("/login", LoginController.login);
router.post("/register", RegisterController.register);

module.exports = router;
