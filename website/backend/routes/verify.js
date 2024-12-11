const express = require("express");
const PROFILE = require("../models/profile");
const axios = require("axios");
const router = express.Router();

async function verifyCodeforcesProfile(username, verificationCode) {
    try {
      const response = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`);
      if (response.data.status === 'OK') {
        const user = response.data.result[0];
        return user.firstName === verificationCode;
      }
      return false;
    } catch (error) {
      console.error('Codeforces API error:', error);
      return false;
    }
  }

router.post("/",async (req,res)=>{
    try{
        const {userId, username, verificationCode, platform} = req.body;
        if (!userId || !platform || !username || !verificationCode) {
            return res.status(400).json({
              success: false,
              message: 'Missing required fields'
            });
          }

          let isVerified = false;

          switch (platform) {
            case 'codeforces':
              isVerified = await verifyCodeforcesProfile(username, verificationCode);
              break;
            // Add other platforms as needed
            default:
              return res.status(400).json({
                success: false,
                message: 'Unsupported platform'
              });
          }

          if (isVerified) {
            // Update user's verified platforms in database
            const profile = await PROFILE.findOneAndUpdate(
              { userId },
              { 
                $set: { 
                  [`verifiedPlatforms.${platform}`]: true 
                }
              }
            );

            await profile.save();
            
            res.json({
              success: true,
              message: 'Profile verified successfully'
            });

          }
          else {
            res.json({
              success: false,
              message: 'Could not verify profile. Please ensure you\'ve updated your profile correctly'
            });
          }
        } catch (error) {
          console.error('Verification error:', error);
          res.status(500).json({
            success: false,
            message: 'Server error during verification',
            error: error.message
          });
        }      
});

module.exports = router;