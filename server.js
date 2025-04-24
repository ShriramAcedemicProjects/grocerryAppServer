require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes=require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes")

const app = express();

// Middleware
app.use(express.json());
app.use(cors());


// Routes
app.use("/api/admin", adminRoutes);
app.use("/ProductsAPI",productRoutes);
app.use("/UserAPI",userRoutes);
app.use("/CartAPI",cartRoutes);
app.use("/OrderAPI",orderRoutes);

// Connect to DB and start server
connectDB();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(` Server running on ${PORT}`);
});

