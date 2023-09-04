const express = require("express");
const auth = require("../middleware/auth");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

const {
  LoginController,
  RegisterController,
  DriveController,
  ProfileController,
} = require("../controllers");

router.get("/", (req, res) => {
  res.status(200).json({ msg: "Home Page" });
});

router.post("/login", LoginController.login);
router.post("/register", RegisterController.register);
router.post("/profile", ProfileController.profile);

router.post("/upload", auth, upload.single("file"), DriveController.upload);
router.post("/getFolderLink", auth, DriveController.getFolderLink);
router.post("/getFiles", auth, DriveController.getFiles);
router.post("/deleteFile", auth, DriveController.deleteFile);

module.exports = router;
