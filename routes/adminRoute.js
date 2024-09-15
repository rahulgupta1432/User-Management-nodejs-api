const express = require("express");
const adminController = require("../controller/adminController");
const { Auth } = require("../middleware/authMiddleware");
const { upload } = require("../helper/uploadFile");

const router = express.Router();

router.get("/fetch/all-user",Auth,adminController.getAllUsers);
router.delete("/delete/user",Auth,adminController.deleteById);

router.put("/update/profile-pic",Auth,upload.single("profilePicture"),adminController.updateProfilePicture);
router.get("/delete/profile",Auth,adminController.deleteProfilePicture);

router.get("/fetch/profile",Auth,adminController.getUserById)

router.put("/update/profile-info",upload.single("profilePicture"),adminController.updateProfileInfo);
module.exports = router;