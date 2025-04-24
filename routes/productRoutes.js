const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware= require("../middleware/auth");

router.post("/add",authMiddleware,productController.createProduct);
router.get("/all",productController.getAllProducts);
router.get("/:id",productController.getProductById);
router.put("/update/:id",authMiddleware,productController.updateProduct);
router.delete("/delete/:id",authMiddleware,productController.deleteProduct);
router.get("/category/:categoryName",productController.getProductsByCategory);

module.exports = router;