require("dotenv").config();

const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "8.8.4.4",
]);

const mongoose = require("mongoose");

let cachedConnection = null;

const connectDB = async () => {
  if (!process.env.DB_URL) {
    throw new Error("DB_URL is missing in Vercel Environment Variables");
  }

  if (cachedConnection) {
    return cachedConnection;
  }

  if (mongoose.connection.readyState === 1) {
    cachedConnection = mongoose.connection;
    return cachedConnection;
  }

  const connection = await mongoose.connect(process.env.DB_URL, {
    serverSelectionTimeoutMS: 10000,
  });

  cachedConnection = connection.connection;

  console.log("MongoDB connected!");

  return cachedConnection;
};

module.exports = connectDB;