const USER = require('../models/user');
const bcrypt = require('bcryptjs');
const {createToken} = require("../services/auth");
const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken"); 

//signup

async function handleSignup(req, res) {
    const { email, password, name } = req.body;

    try {
        // Check if user already exists
        const isUser = await USER.findOne({ email: email });
        if (isUser) {
            return res.json({
                success: false,
                message: 'User email already exists',
            });
        }

        // Generate salt and hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = await USER.create({
            userId: uuidv4(),
            name: name,
            email: email,
            password: hashedPassword,
        });

        return res.json({
            success: true,
            message: 'Signup successful',
            data: user,
        });
    } catch (err) {
        console.error(err);
        return res.json({
            success: false,
            message: 'Signup failed due to internal issues, try again',
        });
    }
}

//login
async function handleLogin(req,res){
    const {email,password} = req.body;

    try{

        const isUser = await USER.findOne({email:email});

        if(!isUser){
            return res.json({
                success:false,
                message:"No account exists, Create account",
            })
        }
        if(isUser){
            const isPassword = await bcrypt.compare(password,isUser.password);

            if(isPassword){
                const token = createToken(isUser);
                return res.cookie("token",token).json({
                    success:true,
                    message:"Login successfull",
                    data:isUser,
                })
            }else{
                return res.json({
                    success:false,
                    message:"Incorrect username or password",
                })
            }
        }
    }catch(err){
        return res.json({
            success:false,
            message:"Login failed, try again",
        })
    }
}


module.exports = {
    handleSignup,
    handleLogin
};
