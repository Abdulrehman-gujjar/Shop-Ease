const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
} = require("../controllers/productController");

const adminProtect = require("../middleware/adminMiddleware");

const router = express.Router();

// =========================
// MULTER IMAGE UPLOAD
// =========================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// =========================
// CUSTOMER ROUTES
// =========================

router.get("/", getProducts);

router.get("/:id", getProductById);

// =========================
// ADMIN PRODUCT ROUTES
// =========================

router.post(
  "/",
  adminProtect,
  upload.single("image"),
  createProduct
);

router.delete(
  "/:id",
  adminProtect,
  deleteProduct
);

module.exports = router;