
// const express = require("express");
// const router = express.Router();
// const {
//   register,
//   verifyOTP,
//   resendOTP,
//   login,
//   isAuth,
//   logout,
//   updateUserLocation,
// } = require("../controller/userController");

// const authUser = require("../middleware/userAuth");

// router.post("/register", register);
// router.post("/verify-otp", verifyOTP);
// router.post("/resend-otp", resendOTP);
// router.post("/login", login);
// router.get("/isAuth", authUser, isAuth);
// router.post("/logout", authUser, logout);
// router.put("/location", authUser, updateUserLocation);
// module.exports = router;





















const express = require("express");
const router = express.Router();
const {
  register,
  verifyOTP,
  resendOTP,
  login,
  isAuth,
  logout,
  updateUserLocation,
} = require("../controller/userController");

const authUser = require("../middleware/userAuth");

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", login);

// ফ্রন্টএন্ড সেফটির জন্য /isAuth এবং /is-auth দুটোই সাপোর্ট রাখা হলো
router.get("/isAuth", authUser, isAuth);
router.get("/is-auth", authUser, isAuth);

router.post("/logout", authUser, logout);
router.put("/location", authUser, updateUserLocation);

module.exports = router;
