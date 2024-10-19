const express = require("express");
const router = express.Router();
const profileModel = require("../models/profile")

//Imports
const {handleProfileSetup, getUserProfile} = require("../controllers/profile")

//Profile-Setup
router.post("/",handleProfileSetup);
router.get("/:userId",getUserProfile);

router.post('/searchLinkedIn', async (req, res) => {
  const { linkedIn } = req.body;

  try {
    // Use .lean() to return plain JavaScript objects
    const users = await profileModel.find({ linkedIn }).lean();

    if (users.length > 0) {
      return res.json({ success: true, data: users });
    } else {
      return res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


module.exports = router;