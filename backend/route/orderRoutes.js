


// const express = require("express");

// const {
//   createOrder,
//   getMyOrders,
//   getSellerOrders,
//   sellerAcceptOrder,
//   getOrderDetails,
// } = require("../controller/orderController");

// const userAuth = require("../middleware/userAuth");
// const sellerAuth = require("../middleware/sellerAuth");

// const router = express.Router();

// // 1. Create Order
// router.post("/create", userAuth, createOrder);

// // 2. Specific routes
// router.get("/my-orders", userAuth, getMyOrders);
// router.get("/seller-orders", sellerAuth, getSellerOrders);
// router.patch("/seller-accept/:orderId", sellerAuth, sellerAcceptOrder);

// // 3. Dynamic route
// router.get("/:orderId", userAuth, getOrderDetails);

// module.exports = router;


























const express = require("express");

const {
  createOrder,
  getMyOrders,
  getSellerOrders,
  cancelCustomerOrder,
  sellerAcceptOrder,
  getOrderDetails,
} = require("../controller/orderController");

const userAuth = require("../middleware/userAuth");
const sellerAuth = require("../middleware/sellerAuth");

const router = express.Router();

// 1. Create Order
router.post("/create", userAuth, createOrder);

// 2. Specific routes
router.get("/my-orders", userAuth, getMyOrders);
router.get("/seller-orders", sellerAuth, getSellerOrders);
router.patch("/seller-accept/:orderId", sellerAuth, sellerAcceptOrder);

// 3. Cancel Order (30 Mins Window & Pre-assignment)
router.patch("/cancel/:orderId", userAuth, cancelCustomerOrder);

// 4. Dynamic route
router.get("/:orderId", userAuth, getOrderDetails);

module.exports = router;