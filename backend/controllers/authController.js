const User = require("../models/user");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        //just to change the git name

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const errors = {}

        if (!email.trim()) {
            errors.email = "Email is required"
        }
        if (email && !emailRegex.test(email)) {
            errors.email = "Invalid email"
        }
        if (!password.trim()) {
            errors.password = "Password is required"
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ success: false, message: "validation failed", data: errors });
        }


        const user = await User.findOne({ email, isDeleted: false });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (user.status !== "Active") {
            return res.status(400).json({ message: "User is inactive" });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successful",
            userId: user._id,
            token
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




module.exports = { login }