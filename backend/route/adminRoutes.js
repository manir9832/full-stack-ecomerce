

// const express = require("express");

// const {
//   loginAdmin,
//   logoutAdmin,
//   isAdminAuth,
//   getAllSellers,
//   approveSeller,
//   getAllDeliveryBoys,
//   approveDeliveryBoy,
//   getAllOrders,
// } = require("../controller/adminController");

// const adminAuth = require("../middleware/adminAuth");

// const router = express.Router();

// // =====================================
// // ADMIN LOGIN
// // =====================================

// router.post("/login", loginAdmin);

// // =====================================
// // ADMIN LOGOUT
// // =====================================

// router.post("/logout", adminAuth, logoutAdmin);

// // =====================================
// // ADMIN AUTH CHECK
// // =====================================

// router.get("/is-auth", adminAuth, isAdminAuth);

// // =====================================
// // GET ALL SELLERS
// // =====================================

// router.get("/sellers", adminAuth, getAllSellers);

// // =====================================
// // APPROVE SELLER
// // =====================================

// router.patch("/seller/:sellerId/approve", adminAuth, approveSeller);

// // =====================================
// // GET ALL DELIVERY BOYS
// // =====================================

// router.get("/delivery-boys", adminAuth, getAllDeliveryBoys);

// // =====================================
// // APPROVE DELIVERY BOY
// // =====================================

// router.patch(
//   "/delivery-boy/:deliveryBoyId/approve",
//   adminAuth,
//   approveDeliveryBoy,
// );

// // =====================================
// // GET ALL ORDERS
// // =====================================

// router.get("/orders", adminAuth, getAllOrders);

// module.exports = router;














const express = require("express");

const {
  loginAdmin,
  logoutAdmin,
  isAdminAuth,
  getAllSellers,
  approveSeller,
  getAllDeliveryBoys,
  approveDeliveryBoy,
  getAllOrders,
} = require("../controller/adminController");

const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// =====================================
// ADMIN LOGIN & AUTH
// =====================================
router.post("/login", loginAdmin);
router.post("/logout", adminAuth, logoutAdmin);
router.get("/is-auth", adminAuth, isAdminAuth);

// =====================================
// GET & APPROVE SELLERS (Auth bypassed for testing)
// =====================================
router.get("/sellers", getAllSellers);
router.patch("/seller/:sellerId/approve", approveSeller);

// =====================================
// GET & APPROVE DELIVERY BOYS (Auth bypassed for testing)
// =====================================
router.get("/delivery-boys", getAllDeliveryBoys);
router.patch(
  "/delivery-boy/:deliveryBoyId/approve",
  approveDeliveryBoy
);

// =====================================
// GET ALL ORDERS (Auth bypassed for testing)
// =====================================
router.get("/orders", getAllOrders);

module.exports = router;
