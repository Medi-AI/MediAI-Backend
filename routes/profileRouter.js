const express = require("express");
const router = express.Router();
const {ProfileController} = require("../controllers");

router.post("/doctor", ProfileController.profile);

module.exports = router;
