const express = require("express");
const authController = require("../controller/authController");

const router = express.Router();

router.post("/register",authController.registerUser);

router.post("/login",authController.loginUser);
router.post("/logout",authController.logoutUser);

module.exports = router;