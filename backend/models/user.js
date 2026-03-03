const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
        trim: true
    },

    lastName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true
    },

    phoneNumber: {
        type: String,
        required: true
    },

    dateOfBirth: {
        type: Date,
        required: true
    },

    age: {
        type: Number,
        required: true
    },

    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true
    },

    role: {
        type: String,
        enum: ["Admin", "User"],
        default: "User"
    },

    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    },

    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String
    },

    profileImage: {
        type: String   // store image URL or file path
    },


    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });


// 🔐 Hash Password Before Save
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});



// 🔑 Compare Password Method
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
