const express = require("express");
const multer = require("multer");

const {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
} = require("../controllers/productController");

const adminProtect = require("../middleware/adminMiddleware");

const router = express.Router();

// Store image temporarily in memory.
// Do not use diskStorage because Vercel filesystem is read-only.
const upload = multer({
  storage: multer.memoryStorage(),

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

// Customer routes
router.get("/", getProducts);

router.get("/:id", getProductById);

// Admin routes
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