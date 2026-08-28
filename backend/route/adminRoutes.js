




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
