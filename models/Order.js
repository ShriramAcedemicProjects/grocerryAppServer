const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User', // <-- This MUST match the model name you used for the User schema
//     required: true,
//   },
  
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  orderStatus: {
    type: String,
    default: 'Pending',
  },
  creationDate: { type: Date, default: Date.now },
  modificationDate: { type: Date, default: Date.now },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ipAddress: { type: String },
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
