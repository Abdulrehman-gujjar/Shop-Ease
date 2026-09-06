require("dotenv").config();

const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "8.8.4.4",
]);
const { connect } = require("mongoose");

const connectDB = async () => {
  try {
    const DB_URL = process.env.DB_URL;

    await connect(DB_URL);

    console.log("DB connected!");
  } catch (error) {
    console.log(`DB could not be connected`, error);
  }
};

module.exports = connectDB;
