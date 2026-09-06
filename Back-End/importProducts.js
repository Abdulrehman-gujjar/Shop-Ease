const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);

const axios = require("axios");
const mongoose = require("mongoose");
const Product = require("./models/Product");

require("dotenv").config();

const importProducts = async () => {
  try {
    console.log("DB_URL loaded:", !!process.env.DB_URL);

    await mongoose.connect(process.env.DB_URL);

    console.log("MongoDB connected!");

    const response = await axios.get(
      "https://dummyjson.com/products?limit=0"
    );

    const products = response.data.products;

    console.log(`Products received: ${products.length}`);

    await Product.deleteMany();

    await Product.insertMany(products);

    console.log(
      `${products.length} products imported successfully!`
    );

    await mongoose.connection.close();

    console.log("MongoDB connection closed.");

    process.exit(0);
  } catch (error) {
    console.log("Import failed:");
    console.log(error.message);

    process.exit(1);
  }
};

importProducts();