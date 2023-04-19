const express = require("express");
const router = express.Router();

const {
  LoginController,
  RegisterController,
  UploadController,
  ProfileController,
} = require("../controllers");

router.get("/", (req, res) => {
  res.status(200).json({ msg: "Home Page" });
});

router.post("/login", LoginController.login);
router.post("/register", RegisterController.register);
router.post("/profile", ProfileController.profile);

router.post("/upload", UploadController.upload);
router.post("/getFolderLink", UploadController.getFolderLink);
router.post("/getFiles", UploadController.getFiles);
router.post("/deleteFile", UploadController.deleteFile);

module.exports = router;
