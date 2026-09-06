const dns = require("dns");
    dns.setServers([
  '8.8.8.8',
  '8.8.4.4'
]);
const express = require("express");
const connectDB = require("./db");

require("dotenv").config();

const app = express();
const PORT = 3000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server could not start:", error.message);
  }
};

startServer();