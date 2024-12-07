const profileModel = require("../models/profile");

// Profile setup
async function handleProfileSetup(req, res) {
    const {
        techStack,userId, firstName, lastName, email, country, college,degree, branch, linkedIn, twitter, website, codeforces, leetcode, codechef, github
    } = req.body;

    try {
        // Check if the user already exists
        let user = await profileModel.findOne({ userId });

        if (user) {
            // Update the existing user
            user.firstName = firstName;
            user.lastName = lastName;
            user.email = email;
            user.country = country;
            user.college = college;
            user.degree = degree;
            user.branch = branch;
            // Update other fields if provided
            user.linkedIn = linkedIn;
            user.twitter = twitter;
            user.website = website;
            user.codeforces = codeforces;
            user.leetcode = leetcode;
            user.codechef = codechef;
            user.github = github;
            user.techStack = techStack;
            await user.save(); // Save the updated user
            return res.json({ success: true, message: "Profile Updated", data: user });
        } else {
            // Create a new user
            user = await profileModel.create({
                userId,
                lastName,
                firstName,
                email,
                college,
                country,
                degree,
                branch,
                linkedIn, 
                twitter, 
                website, 
                codeforces, 
                leetcode, 
                codechef, 
                github,
                techStack,
            });
            return res.json({ success: true, message: "Profile Saved", data: user });
        }
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error! Try again" });
    }
}

async function getUserProfile(req,res){
    const {userId} = req.params;
    try{
        const user = await profileModel.findOne({userId});
        if(user){
            return res.json({success:true,data:user});
        }else{
            return res.json({success:false,message:"User not found"});
        }
    }catch(err){
        console.log(err);
    }
}

module.exports = { handleProfileSetup, getUserProfile };
