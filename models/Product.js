const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "Product name must be at least 3 characters"]
    },
    price: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Price cannot be negative"]
    },
    basicPrice: {
      type: Number,
      required: [true, "Basic price is required"],
      min: [0, "Basic price cannot be negative"]
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"]
    },
    sellingPrice: {
      type: Number,
      required: [true, "Selling price is required"],
      min: [0, "Selling price cannot be negative"]
    },
    tax: {
      type: Number, // assuming GST in percentage
      default: 0,
      min: [0, "Tax rate cannot be negative"]
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"]
    },
    imageUrl: {
        type: String,
        required: [true, "Primary product image is required"]
      },
    inStock: {
      type: Boolean,
      default:true,
    },
    

    // Audit fields
    creationDate: {
      type: Date,
      default: Date.now
    },
    modificationDate: {
      type: Date,
      default: Date.now
    },
    creator: {
      type: String
    },
    ipAddress: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
