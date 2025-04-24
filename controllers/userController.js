const bcrypt = require('bcrypt');
const User = require("../models/User");
const { generateToken } = require("../utils/jwtUtils");

// Register User
exports.registerUser = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    confirmPassword,
    ipAddress,
  } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      ipAddress,
    });

    // Save to database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({
      message: "Error in registration. Please try again!",
      error: error.message,
    });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid Login Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid Credentials" });

    const token = generateToken(user._id);
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.firstName,
        email: user.email,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error during login", error: error.message });
  }
};

// Get User Profile (Protected Route)
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Provided by userAuth middleware

    const user = await User.findById(userId).select(
      "firstName lastName email phone"
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get user profile",
      error: error.message,
    });
  }
};
