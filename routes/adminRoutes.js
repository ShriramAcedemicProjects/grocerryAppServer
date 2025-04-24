const express = require("express");
const { registerAdmin, loginAdmin } = require("../controllers/adminController");
// const authMiddleware = require("../middleware/auth")
// const authorizeAdmin = require("../middleware/authorizeAdmin")
const router = express.Router();
const adminController = require("../controllers/adminController")

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
// router.get('/dashboard', authMiddleware, authorizeAdmin, adminController.dashboard);
// router.post('/add-product', authMiddleware, authorizeAdmin, adminController.addProduct);

module.exports = router;
