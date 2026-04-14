const mongoose = require('mongoose');
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const connectDB = async () => {
    
    await mongoose.connect(
       process.env.DB_CONNECTION
    )
    
}

module.exports = connectDB;

 