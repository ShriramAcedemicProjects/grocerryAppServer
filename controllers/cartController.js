const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { populate } = require('../models/User');

// Add or update product(s) in cart
// controllers/cartController.js


exports.addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ user: userId });

    const commonFields = {
      creator: userId,
      ipAddress: req.ip,
      modificationDate: new Date(),
    };

    if (!cart) {
      // Creating new cart
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity }],
        creationDate: new Date(),
        ...commonFields,
      });
    } else {
      // Update existing cart
      const existingItem = cart.items.find(item => item.product.toString() === productId);
      if (existingItem) {
        existingItem.quantity += parseInt(quantity);
      } else {
        cart.items.push({ product: productId, quantity });
      }

      cart.modificationDate = new Date();
      cart.ipAddress = req.ip;
      cart.creator = userId;
    }

    await cart.save();
    const populatedCart = await Cart.findOne({ user: userId }).populate('items.product');
console.log(populatedCart)
    res.status(200).json({ cart: populatedCart });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

// Get current user's cart
exports.getCart = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const cart = await Cart.findOne({ user: userId }).populate('items.product');
  
      if (!cart || cart.items.length === 0) {
        return res.status(200).json({ message: 'Cart is empty', cart: [] });
      }
  
      res.status(200).json({ cart });
    } catch (error) {
      console.error('Error in getCart:', error);
      res.status(500).json({ message: 'Server error', details: error.message });
    }
  };
  
// In cartController.js
exports.updateQuantity = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;
  
    try {
      // Find the user's cart and populate product details
      const cart = await Cart.findOne({ user: userId }).populate('items.product');
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      // Fix: Convert ObjectIds to strings before comparing
      const item = cart.items.find(item => item.product._id.toString() === productId);
      if (!item) {
        return res.status(404).json({ message: 'Product not found in cart' });
      }
  
      // Update the quantity
      item.quantity = quantity;
  
      // Update modification date
      cart.modificationDate = new Date();
      await cart.save();
  
      return res.status(200).json({ message: 'Cart item updated', cart });
    } catch (error) {
      console.error("Update error:", error);
      return res.status(500).json({
        message: 'Failed to update cart item',
        details: error.message
      });
    }
  };
  
  // In cartController.js
exports.removeFromCart = async (req, res) => {
    const { productId } = req.params; // Get the product ID from the URL params
    const userId = req.user.id;
  
    try {
      // Find the user's cart
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      // Remove the item from the cart
      cart.items = cart.items.filter(item => item.product.toString() !== productId);
      
      // Save the updated cart
      cart.modificationDate = new Date();
      await cart.save();
  
      return res.status(200).json({ message: 'Item removed from cart', cart });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to remove item from cart', details: error.message });
    }
  };
  
  // In cartController.js
exports.clearCart = async (req, res) => {
    const userId = req.user.id;
  
    try {
      // Find and delete the user's cart
      await Cart.findOneAndDelete({ user: userId });
  
      return res.status(200).json({ message: 'Cart cleared' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to clear cart', details: error.message });
    }
  };
  