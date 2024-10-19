const mongoose = require("mongoose");

//Schema
const userSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        unique: true, 
        required: true 
    },
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    }
})

const USER = mongoose.model("user",userSchema);

module.exports = USER;