

const express = require("express");

const {
  createRazorpayOrder,
  verifyPayment,
} = require("../controller/paymentController");

const userAuth = require("../middleware/userAuth");

const router = express.Router();

// =====================================
// CREATE RAZORPAY ORDER
// =====================================

router.post("/create-order", userAuth, createRazorpayOrder);

// =====================================
// VERIFY PAYMENT
// =====================================

router.post("/verify", userAuth, verifyPayment);

module.exports = router;
