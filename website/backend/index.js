require("dotenv").config();
const express = require("express");
const cookieParser = require('cookie-parser'); 
const app = express();
const cors = require("cors")

//Imports 
const {dbConnect} = require("./connections/dbConnect")
const profileRouter = require("./routes/profile")
const userRoute = require("./routes/user");
const verifyRoute = require("./routes/verify");

//DB Connection
dbConnect("mongodb://127.0.0.1:27017/IntertWin")
.then(()=>console.log("MongoDB Connected"));

//Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors({
    origin: [
        "http://localhost:5173", // Your React frontend
        "http://127.0.0.1:5500", // Your popup's origin
        "chrome-extension://chjjhnjalneidlppjpogmbgfplkncbmc", // Your Chrome extension ID
        "http://localhost:3000",
        "http://localhost:3001",
        "https://pinned.berrysauce.me",
        "hhttps://alfa-leetcode-api.onrender.com",
        "https://codeforces.com"
    ],
    credentials: true,
}))

//router
app.use("/profile",profileRouter);
app.use("/user",userRoute);
app.use("/verify",verifyRoute);

//Server Connect
const PORT = 8000;
app.listen(PORT,()=>console.log("Server Started"))