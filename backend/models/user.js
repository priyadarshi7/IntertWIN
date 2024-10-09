const mongoose = require("mongoose");

// Schema
const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    // Personal
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    country: {
        type: String,
    },
    // Educational
    college: {
        type: String,
    },
    degree: {
        type: String,
    },
    branch: {
        type: String,
    },
    // Socials
    linkedIn: {
        type: String,
    },
    twitter: {
        type: String,
    },
    website: {
        type: String,
    },
    // Platforms
    codeforces: {
        type: String,
    },
    leetcode: {
        type: String,
    },
    codechef: {
        type: String,
    },
});

// Model
const UserModel = mongoose.model("User", userSchema);

// Export the model
module.exports = UserModel;
