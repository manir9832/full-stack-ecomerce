
const express = require("express");

const {
  registerDeliveryBoy,
  loginDeliveryBoy,
  logoutDeliveryBoy,
  isDeliveryBoyAuth,
  approveDeliveryBoy,

  updateDeliveryBoyLocation,
  goOnline,
  goOffline,

  acceptDelivery,
  markPickedUp,
  markOutForDelivery,
  markDelivered,
  getDeliveryBoyOrders,
  getDeliveryBoyEarnings,
  getTodayEarnings,
  getAvailableOrders
} = require("../controller/deliveryController");

const deliveryBoyAuth = require("../middleware/deliveryAuth");

const router = express.Router();

// =====================================
// DELIVERY BOY REGISTER
// =====================================

router.post("/register", registerDeliveryBoy);

// =====================================
// DELIVERY BOY LOGIN
// =====================================

router.post("/login", loginDeliveryBoy);

// =====================================
// DELIVERY BOY LOGOUT
// =====================================

router.post("/logout", deliveryBoyAuth, logoutDeliveryBoy);

// =====================================
// DELIVERY BOY AUTH CHECK
// =====================================

router.get("/is-auth", deliveryBoyAuth, isDeliveryBoyAuth);

// =====================================
// ADMIN APPROVE DELIVERY BOY
// =====================================

router.patch("/approve/:deliveryBoyId", approveDeliveryBoy);

// =====================================
// UPDATE DELIVERY BOY LOCATION
// =====================================

router.put("/location", deliveryBoyAuth, updateDeliveryBoyLocation);

// =====================================
// GO ONLINE
// =====================================

router.put("/online", deliveryBoyAuth, goOnline);

// =====================================
// GO OFFLINE
// =====================================

router.put("/offline", deliveryBoyAuth, goOffline);

// =====================================
// DELIVERY BOY ACCEPT ORDER
// =====================================

router.patch("/accept/:orderId", deliveryBoyAuth, acceptDelivery);

// =====================================
// MARK ORDER PICKED UP
// =====================================

router.patch("/picked-up/:orderId", deliveryBoyAuth, markPickedUp);

// =====================================
// MARK OUT FOR DELIVERY
// =====================================

router.patch("/out-for-delivery/:orderId", deliveryBoyAuth, markOutForDelivery);

// =====================================
// MARK DELIVERED
// =====================================

router.patch("/delivered/:orderId", deliveryBoyAuth, markDelivered);
// =====================================
// DELIVERY BOY ORDERS
// =====================================

router.get("/orders", deliveryBoyAuth, getDeliveryBoyOrders);

// =====================================
// DELIVERY BOY TOTAL EARNINGS
// =====================================

router.get("/earnings", deliveryBoyAuth, getDeliveryBoyEarnings);

// =====================================
// TODAY'S EARNINGS
// =====================================

router.get("/today-earnings", deliveryBoyAuth, getTodayEarnings);


// Available Orders for Delivery Partner
router.get("/available-orders", deliveryBoyAuth, getAvailableOrders);
module.exports = router;
