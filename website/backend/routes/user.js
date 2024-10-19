const express = require("express");
const { handleSignup, handleLogin,getUser} = require("../controllers/user");
const router = express.Router();

router.post("/signup",handleSignup);
router.post("/login", handleLogin);

module.exports = router;