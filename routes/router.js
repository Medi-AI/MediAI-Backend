const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

router.post("/upload", auth, upload.single("file"), UploadController.upload);
router.post("/getFolderLink", auth, UploadController.getFolderLink);
router.post("/getFiles", auth, UploadController.getFiles);
router.post("/deleteFile", auth, UploadController.deleteFile);

module.exports = router;
