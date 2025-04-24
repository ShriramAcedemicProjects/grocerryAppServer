const express = require("express");
const userController = require('../controllers/userController')
const authenticate = require("../middleware/auth")
// const {registerUser, loginUser} = require("../controllers/userController");

const router = express.Router();

router.post("/signup",userController.registerUser);
router.post("/login",userController.loginUser);
router.get("/profile",authenticate,userController.getUserProfile)

module.exports = router;