

// const express = require("express");

// const {
//   getAllProducts,
//   getProductById,
//   getProductsByCategory,
//   searchProducts,
// } = require("../controller/productController");

// const router = express.Router();

// // =====================================
// // GET ALL PRODUCTS
// // =====================================

// router.get("/", getAllProducts);

// // =====================================
// // GET PRODUCTS BY CATEGORY
// // =====================================

// router.get("/category/:category", getProductsByCategory);

// // =====================================
// // SEARCH PRODUCTS
// // =====================================

// router.get("/search", searchProducts);

// // =====================================
// // GET SINGLE PRODUCT
// // IMPORTANT: Keep this route LAST
// // =====================================

// router.get("/:productId", getProductById);

// module.exports = router;




















const express = require("express");

const {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
} = require("../controller/productController");

const router = express.Router();

router.get("/", getAllProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/search", searchProducts);
router.get("/:productId", getProductById);

module.exports = router;