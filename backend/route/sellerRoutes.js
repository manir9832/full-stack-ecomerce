

const express = require("express");

const router = express.Router();

const {
  registerSeller,
  loginSeller,
  logoutSeller,
  isSellerAuth,
  updateStoreLocation,
  getSellerDashboardStats
} = require("../controller/sellerController");

const sellerAuth = require("../middleware/sellerAuth");

router.post("/register", registerSeller);
router.post("/login", loginSeller);
router.post("/logout", logoutSeller);
router.get("/isAuth", sellerAuth, isSellerAuth);
router.put("/location", sellerAuth, updateStoreLocation);
router.get("/dashboard-stats", sellerAuth, getSellerDashboardStats);

module.exports = router;
