const express = require("express");
const adminController = require("../controller/adminController");
const { Auth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/fetch/all-user",Auth,adminController.getAllUsers);


module.exports = router;