const mongoose = require("mongoose");
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  const dbUri = process.env.DB_URI || process.env.DB_CONNECTION;
  if (!dbUri) {
    throw new Error("Missing required environment variable: DB_URI (or legacy DB_CONNECTION)");
  }

  await mongoose.connect(dbUri);
};

module.exports = connectDB;