const express = require("express");
const authController = require("../controller/authController");
const { Auth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register",authController.registerUser);

router.post("/login",authController.loginUser);
router.post("/logout",Auth,authController.logoutUser);

module.exports = router;