const mongoose = require("mongoose");

async function dbConnect(url){
    return await mongoose.connect(url);
}

module.exports = {dbConnect}