require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/user");

const createAdmin = async () => {
    try {
        await connectDB();

        const existingAdmin = await User.findOne({ role: "Admin" });

        if (existingAdmin) {
            console.log("Admin already exists.");
            process.exit();
        }

        await User.create({
            firstName: "Super",
            lastName: "Admin",
            email: "admin@gmail.com",
            password: "admin123",
            phoneNumber: "9999999999",
            dateOfBirth: "2000-01-01",
            age: 25,
            gender: "Female",
            role: "Admin",
            status: "Active",
            address: {
                street: "Main Street",
                city: "Yamunanagar",
                state: "Haryana",
                country: "India",
                zipCode: "135001"
            },
            profileImage: "/public/download.jpg"
        });

        console.log("Admin created successfully!");
        process.exit();

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

createAdmin();
