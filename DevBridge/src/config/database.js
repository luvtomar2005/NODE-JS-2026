const mongoose = require('mongoose');
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://luvtomar2005_db_user:7ps7LcLlCRJAer5l@cluster0.xaaaxev.mongodb.net/DevBridge"
    )
}

module.exports = connectDB;

 