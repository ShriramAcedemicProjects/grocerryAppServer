const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getAllOrders,updateStatus,printOrder } = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth'); // Your auth middleware

// User routes
router.post('/create', authMiddleware, createOrder); // User creates an order
router.get('/my-orders', authMiddleware,getUserOrders); // User views their orders

// Admin routes
router.get('/all-orders', getAllOrders); // Admin views all orders
router.put('/update-status/:orderId',updateStatus)
router.get("/print-bill/:orderId",printOrder)
module.exports = router;
