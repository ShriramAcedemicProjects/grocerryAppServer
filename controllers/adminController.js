const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const registerAdmin = async (req, res) => {
    const { username, password, creator, ipAddress } = req.body;

    try {
        let admin = await Admin.findOne({ username });
        if (admin) return res.status(400).json({ message: "Admin already exists" });

        admin = new Admin({ username, password, creator, ipAddress });
        await admin.save();

        res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error",error });
    }
};

const loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(400).json({ message: "Admin not found" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" ,error});

        const token = jwt.sign(
            { id: admin._id ,role:"admin",username:admin.username}, 
            process.env.JWT_SECRET, 
            { expiresIn: "1d" }
        );
        res.json({ 
            message: "Login successful!", 
            token 
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error",error });
    }

    console.log(process.env.JWT_SECRET);

};


module.exports = { registerAdmin, loginAdmin };
