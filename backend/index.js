const express = require("express");
const app = express();
const cors = require("cors")

//Imports 
const {dbConnect} = require("./connections/dbConnect")
const userRouter = require("./routes/user")

//DB Connection
dbConnect("mongodb://127.0.0.1:27017/IntertWin")
.then(()=>console.log("MongoDB Connected"));

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors({
    origin:"*"
}))

//router
app.use("/user",userRouter);

//Server Connect
const PORT = 8000;
app.listen(PORT,()=>console.log("Server Started"))