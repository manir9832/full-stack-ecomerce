

// // // routes/sellerProductRoutes.js
// // const express = require("express");
// // const {
// //   addProduct,
// //   getMyProducts,
// //   getSingleProduct,
// //   updateProduct,
// //   deleteProduct,
// //   updateStock,
// //   updatePrice,
// //   updateDiscount,
// //   getAllProductsForCustomer,
// //   toggleProductStatus
// // } = require("../controller/sellerProductController");

// // const sellerAuth = require("../middleware/sellerAuth");

// // // 👉 config ফোল্ডার থেকে multer ইমপোর্ট করুন
// // const upload = require("../config/multer"); 

// // const router = express.Router();

// // // 👉 upload.single("image") যোগ করুন
// // router.post("/add", sellerAuth, upload.single("image"), addProduct);

// // router.get("/list", sellerAuth, getMyProducts);
// // router.get("/:productId", sellerAuth, getSingleProduct);
// // router.put("/update/:productId", sellerAuth, upload.single("image"), updateProduct);
// // router.delete("/delete/:productId", sellerAuth, deleteProduct);
// // router.patch("/stock/:productId", sellerAuth, updateStock);
// // router.patch("/price/:productId", sellerAuth, updatePrice);
// // router.patch("/discount/:productId", sellerAuth, updateDiscount);
// // router.patch("/status/:productId", sellerAuth, toggleProductStatus);
// // router.get("/all", getAllProductsForCustomer);

// // module.exports = router;


// const express = require("express");
// const {
//   addProduct,
//   getMyProducts,
//   getSingleProduct,
//   updateProduct,
//   deleteProduct,
//   updateStock,
//   updatePrice,
//   updateDiscount,
//   getAllProductsForCustomer,
//   toggleProductStatus
// } = require("../controller/sellerProductController");

// const sellerAuth = require("../middleware/sellerAuth");
// const upload = require("../config/multer");

// const router = express.Router();

// // 🟢 ১. কাস্টমার পাবলিক রাউট (সবার উপরে রাখতে হবে)
// router.get("/all", getAllProductsForCustomer);

// // 🔒 ২. সেলার প্রোটেক্টেড রাউটস
// router.post("/add", sellerAuth, upload.single("image"), addProduct);
// router.get("/list", sellerAuth, getMyProducts);
// router.put("/update/:productId", sellerAuth, upload.single("image"), updateProduct);
// router.delete("/delete/:productId", sellerAuth, deleteProduct);
// router.patch("/stock/:productId", sellerAuth, updateStock);
// router.patch("/price/:productId", sellerAuth, updatePrice);
// router.patch("/discount/:productId", sellerAuth, updateDiscount);
// router.patch("/status/:productId", sellerAuth, toggleProductStatus);

// // ⚠️ ৩. প্যারামিটারাইজড রাউট সবার নিচে থাকবে
// router.get("/:productId", sellerAuth, getSingleProduct);

// module.exports = router;

























const express = require("express");
const {
  addProduct,
  getMyProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  updatePrice,
  updateDiscount,
  getAllProductsForCustomer,
  toggleProductStatus,
} = require("../controller/sellerProductController");

const sellerAuth = require("../middleware/sellerAuth");
const upload = require("../config/multer");

const router = express.Router();

// 🟢 ১. কাস্টমার পাবলিক রাউট
router.get("/all", getAllProductsForCustomer);

// 🔒 ২. সেলার প্রোটেক্টেড রাউটস (একাধিক ইমেজ আপলোডের জন্য upload.array ব্যবহার করা হলো)
// router.post("/add", sellerAuth, upload.array("images", 3), addProduct);
router.post("/add", sellerAuth, upload.any(), addProduct);
router.get("/list", sellerAuth, getMyProducts);
router.put("/update/:productId", sellerAuth, upload.array("images", 3), updateProduct);
router.delete("/delete/:productId", sellerAuth, deleteProduct);
router.patch("/stock/:productId", sellerAuth, updateStock);
router.patch("/price/:productId", sellerAuth, updatePrice);
router.patch("/discount/:productId", sellerAuth, updateDiscount);
router.patch("/status/:productId", sellerAuth, toggleProductStatus);

// ⚠️ ৩. প্যারামিটারাইজড রাউট
router.get("/:productId", sellerAuth, getSingleProduct);

module.exports = router;