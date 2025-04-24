const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authenticate = require('../middleware/auth'); // JWT Auth

router.post('/add', authenticate, cartController.addToCart);
router.get('/show', authenticate, cartController.getCart);
router.put('/update', authenticate, cartController.updateQuantity);
router.delete('/remove/:productId', authenticate, cartController.removeFromCart);
router.delete('/clear', authenticate, cartController.clearCart);

module.exports = router;
