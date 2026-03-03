const User = require("../models/user");

const createUser = async (req, res) => {
    try {
        const details = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const status = details.status ? "Active" : "Inactive";


        const errors = {}

        if (!details.firstName.trim()) {
            errors.firstName = "First Name is required";

        }
        if (!details.lastName.trim()) {
            errors.lastName = "Last Name is required";

        }
        if (!details.email.trim()) {
            errors.email = "Email is required";

        }
        if (!emailRegex.test(details.email)) {
            errors.email = "Invalid email";

        }
        if (details.password.length < 6) {
            errors.password = "Minimum 6 Characters required in password";

        }
        if (!details.gender) {
            errors.gender = "gender is required";

        }
        if (!details.street || !details.city || !details.state || !details.country || !details.zipCode) {
            errors.address = "Address is incomplete"

        }
        if (!details.age) {
            errors.gender = "age is required";

        }
        if (!details.dateOfBirth) {
            errors.dateOfBirth = "dob is required";

        }
        if (details.dateOfBirth) {
            const dob = new Date(details.dateOfBirth);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (dob >= today) {
                errors.dateOfBirth = "Invalid Date of Birth"
            }
        }


        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ success: false, message: "Validation errors", data: errors })
        }

        const user = await User.create({
            firstName: details.firstName,
            lastName: details.lastName,
            email: details.email,
            password: details.password,
            phoneNumber: details.phoneNumber,
            dateOfBirth: details.dateOfBirth,
            age: details.age,
            gender: details.gender,
            role: "User",
            status: status,
            address: {
                street: details.street,
                city: details.city,
                state: details.state,
                country: details.country,
                zipCode: details.zipCode,
            },
            profileImage: "/public/download.jpg"
        });

        return res.status(201).json({ success: true, message: "User created Successfully", data: user });
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Error while creating a user" });
    }

}


const getUsers = async (req, res) => {

    try {
        const users = await User.find({ isDeleted: false }).select("-password");
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

const getUser = async (req, res) => {

    try {
        const id = req.params.id;
        const user = await User.findOne({ _id: id, isDeleted: false }).select("-password");
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User is here",
            data: user
        });
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            success: true,
            message: error.message
        });
    }

}

const updateUser = async (req, res) => {

    try {
        const id = req.params.id;
        req.body.status = req.body.status ? "Active" : "Inactive";
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).select("-password");

        if (!updatedUser) {
            console.log("No User found so no update");
            res.status(404).json({
                success: false,
                message: "User Not Found",
            })
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser
        });

    }
    catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: true,
            message: "Server side error"
        })
    }

}


const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);

        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        user.isDeleted = !user.isDeleted;
        await user.save();

        console.log("Updated user is: ", user);
        res.status(200).json({
            success: true,
            message: "User deleted Successfully"
        })

    }
    catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: "Server side error"
        });
    }

}

module.exports = { createUser, getUsers, getUser, deleteUser, updateUser }