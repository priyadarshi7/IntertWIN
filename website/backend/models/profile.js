const mongoose = require("mongoose");

// Schema
const profileSchema = new mongoose.Schema({
    userId: {
        type: String,
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
    github: {
        type: String,
    },
    techStack: [{type:String}]
});

// Model
const profileModel = mongoose.model("Profile", profileSchema);

// Export the model
module.exports = profileModel;
