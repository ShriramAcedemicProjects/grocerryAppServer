const Order = require('../models/Order');
// const User = require("../models/User");
const puppeteer = require("puppeteer");

exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

    const newOrder = new Order({
      userId: req.user._id,  // This is the logged-in user's ID
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      orderStatus: 'Pending',
      creator: req.user._id,  // Order creator is the user
      ipAddress: req.ip,
    });

    await newOrder.save();
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: newOrder,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Order creation failed",
      error: error.message,
    });
  }
};

exports.getUserOrders = async (req, res) => {
    try {
      const orders = await Order.find({ userId: req.user._id }).populate("items.product");
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Failed to fetch user orders",
        error: error.message,
      });
    }
  };

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.product").populate("userId");
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

exports.updateStatus = async (req, res) => {
    try {
      console.log("Body received:", req.body); // ✅ Debug log
  
      const { status } = req.body;
      console.log(status)
      const { orderId } = req.params;
  
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
  
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { orderStatus: status, modificationDate: new Date() },
        { new: true }
      );
  
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      res.status(200).json({
        success: true,
        message: "Order status updated successfully",
        order: updatedOrder,
      });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update status",
        error: error.message,
      });
    }
  };

exports.printOrder = async (req, res) => {
    try {
      const order = await Order.findById(req.params.orderId)
        .populate("userId") // Correct field based on your schema
        .populate("items.product"); // Ensure products are populated for price/name
  
      if (!order) return res.status(404).json({ message: "Order not found" });
  
      if (!order.userId) {
        return res.status(400).json({ message: "User data is missing in the order" });
      }
  
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #2e6c80; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
              h3 { color: #333; }
            </style>
          </head>
          <body>
            <h1>Order Bill - ${order._id}</h1>
            <p><strong>Customer:</strong> ${order.userId.firstName} ${order.userId.lastName}</p>
            <p><strong>Email:</strong> ${order.userId.email}</p>
            <p><strong>Phone:</strong> ${order.shippingAddress.phone}</p>
            <p><strong>Address:</strong> ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}</p>
            
            <h3>Order Details:</h3>
            <table>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
              ${order.items
                .map(
                  (item) => `
                    <tr>
                      <td>${item.product.name}</td>
                      <td>${item.quantity}</td>
                      <td>₹${item.product.price}</td>
                    </tr>
                  `
                )
                .join("")}
            </table>
  
            <h3>Total: ₹${order.totalAmount}</h3>
            <p>Status: ${order.orderStatus}</p>
          </body>
        </html>
      `;
  
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: "networkidle0" });
      const pdfBuffer = await page.pdf({ format: "A4" });
      await browser.close();
  
      res.set({
        "Content-Type": "application/pdf",
        "Content-Length": pdfBuffer.length,
      });
  
      return res.send(pdfBuffer);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to generate PDF", error: err.message });
    }
  };