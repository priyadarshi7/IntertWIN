const express = require("express");
const router = express.Router();

//Imports
const {handleProfileSetup, getUserProfile} = require("../controllers/user")

//Profile-Setup
router.post("/profile",handleProfileSetup);
router.get("/profile/:userId",getUserProfile);

module.exports = router;