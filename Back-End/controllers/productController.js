const Product = require("../models/Product");

// =========================
// GET ALL PRODUCTS
// =========================

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.status(200).json(products);
  } catch (error) {
    console.log("Get products error:", error);

    res.status(500).json({
      message: "Failed to get products",
    });
  }
};

// =========================
// GET SINGLE PRODUCT
// =========================

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    console.log("Get product error:", error);

    res.status(500).json({
      message: "Failed to get product",
    });
  }
};

// =========================
// CREATE PRODUCT
// =========================

const createProduct = async (req, res) => {
  try {
    const {
      title,
      price,
      category,
    } = req.body;

    // Check basic fields
    if (
      !title ||
      price === undefined ||
      !category
    ) {
      return res.status(400).json({
        message:
          "Please provide title, price and category",
      });
    }

    // Check image
    if (!req.file) {
      return res.status(400).json({
        message: "Please select a product image",
      });
    }

    // Image URL
    const imageUrl = `/uploads/${req.file.filename}`;

    // Create product
    const product = await Product.create({
      title: title.trim(),
      price: Number(price),
      category: category.trim(),
      thumbnail: imageUrl,
      images: [imageUrl],
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log("Create product error:", error);

    res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// =========================
// DELETE PRODUCT
// =========================

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log("Delete product error:", error);

    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
};