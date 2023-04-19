const express = require("express");
const router = express.Router();
const {ProfileController} = require("../controllers");

router.post("/profile", ProfileController.profile);

module.exports = router;
