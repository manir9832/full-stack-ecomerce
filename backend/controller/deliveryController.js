


// const DeliveryBoy = require("../model/deliveryBoy");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const Order = require("../model/order");
// const { encrypt } = require("../utils/encryption");
// const { getIO } = require("../config/socket");
// const Notification = require("../model/deliveryNotification");

// // deliveryController.js - registerDeliveryBoy
// const registerDeliveryBoy = async (req, res) => {
//   try {
//     const { name, phone, password, aadhaarNumber } = req.body;

//     if (!name || !phone || !password || !aadhaarNumber) {
//       return res.status(400).json({
//         message: "Name, phone, password, and Aadhaar number are required",
//       });
//     }

//     const existingDeliveryBoy = await DeliveryBoy.findOne({ phone });
//     if (existingDeliveryBoy) {
//       return res.status(400).json({
//         message: "Delivery boy already exists with this phone number",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const encryptedAadhaar = encrypt(aadhaarNumber);

//     const deliveryBoy = await DeliveryBoy.create({
//       name,
//       phone,
//       password: hashedPassword,
//       aadhaarNumber: encryptedAadhaar,
//       role: "deliveryBoy",
//       isApproved: false,
//       isOnline: false,
//       isAvailable: true,
//     });

//     try {
//       const io = getIO();
//       if (io) {
//         io.emit("newDeliveryBoy", {
//           deliveryBoyId: deliveryBoy._id,
//           name: deliveryBoy.name,
//           phone: deliveryBoy.phone,
//           message: "New delivery partner registration request",
//         });
//       }
//     } catch (socketErr) {
//       console.warn("Socket notification warning:", socketErr.message);
//     }

//     res.status(201).json({
//       message: "Delivery partner registered successfully. Waiting for admin approval.",
//       deliveryBoyId: deliveryBoy._id,
//     });
//   } catch (error) {
//     console.error("Delivery Partner Register Error:", error);
//     res.status(500).json({
//       message: "Server error: " + error.message,
//     });
//   }
// };

// const loginDeliveryBoy = async (req, res) => {
//   try {
//     const { phone, password } = req.body;

//     const deliveryBoy = await DeliveryBoy.findOne({ phone });
//     if (!deliveryBoy) {
//       return res.status(400).json({ message: "Delivery boy not found" });
//     }

//     const isPasswordCorrect = await bcrypt.compare(password, deliveryBoy.password);
//     if (!isPasswordCorrect) {
//       return res.status(400).json({ message: "Invalid password" });
//     }

//     if (!deliveryBoy.isApproved) {
//       return res.status(403).json({
//         message: "Your delivery boy account is not approved yet",
//       });
//     }

//     const token = jwt.sign(
//       {
//         id: deliveryBoy._id,
//         role: deliveryBoy.role,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "6h" }
//     );

//     res.cookie("deliveryBoyToken", token, {
//       httpOnly: true,
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 6 * 60 * 60 * 1000,
//     });

//     res.status(200).json({
//       message: "Delivery boy logged in successfully",
//       token,
//       deliveryBoy: {
//         id: deliveryBoy._id,
//         _id: deliveryBoy._id,
//         name: deliveryBoy.name,
//         phone: deliveryBoy.phone,
//         role: deliveryBoy.role,
//         isOnline: deliveryBoy.isOnline,
//       },
//     });
//   } catch (error) {
//     console.error("Delivery Boy Login Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// const logoutDeliveryBoy = async (req, res) => {
//   try {
//     res.clearCookie("deliveryBoyToken", {
//       httpOnly: true,
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
//       secure: process.env.NODE_ENV === "production",
//     });

//     if (req.deliveryBoy?.id) {
//       await DeliveryBoy.findByIdAndUpdate(req.deliveryBoy.id, {
//         isOnline: false,
//       });
//     }

//     res.status(200).json({
//       message: "Delivery boy logged out successfully",
//     });
//   } catch (error) {
//     console.error("Delivery Boy Logout Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// const isDeliveryBoyAuth = async (req, res) => {
//   try {
//     const deliveryBoy = await DeliveryBoy.findById(req.deliveryBoy.id).select(
//       "-password -aadhaarNumber"
//     );

//     if (!deliveryBoy) {
//       return res.status(404).json({
//         message: "Delivery boy not found",
//       });
//     }

//     res.status(200).json({ deliveryBoy });
//   } catch (error) {
//     console.error("Delivery Boy Auth Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// const approveDeliveryBoy = async (req, res) => {
//   try {
//     const { deliveryBoyId } = req.params;

//     const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);
//     if (!deliveryBoy) {
//       return res.status(404).json({ message: "Delivery boy not found" });
//     }

//     if (deliveryBoy.isApproved) {
//       return res.status(400).json({ message: "Delivery boy is already approved" });
//     }

//     deliveryBoy.isApproved = true;
//     await deliveryBoy.save();

//     await Notification.create({
//       deliveryBoyId: deliveryBoy._id,
//       type: "delivery_boy_approved",
//       message: "Your delivery boy account has been approved. You can login now.",
//       isRead: false,
//     });

//     const io = getIO();
//     if (io) {
//       io.to(`deliveryBoy_${deliveryBoy._id}`).emit("deliveryBoyApproved", {
//         message: "Your delivery boy account has been approved. You can login now.",
//       });
//     }

//     res.status(200).json({
//       message: "Delivery boy approved successfully",
//       deliveryBoyId: deliveryBoy._id,
//     });
//   } catch (error) {
//     console.error("Approve Delivery Boy Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// const updateDeliveryBoyLocation = async (req, res) => {
//   try {
//     const { latitude, longitude } = req.body;
//     const lat = Number(latitude);
//     const lng = Number(longitude);

//     if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
//       return res.status(400).json({
//         message: "Valid latitude and longitude are required",
//       });
//     }

//     const deliveryBoy = await DeliveryBoy.findById(req.deliveryBoy.id);
//     if (!deliveryBoy) {
//       return res.status(404).json({ message: "Delivery boy not found" });
//     }

//     deliveryBoy.location = { latitude: lat, longitude: lng };
//     await deliveryBoy.save();

//     const io = getIO();
//     if (io && deliveryBoy.isOnline) {
//       io.emit("deliveryBoyLocationUpdated", {
//         deliveryBoyId: deliveryBoy._id,
//         latitude: lat,
//         longitude: lng,
//       });
//     }

//     res.status(200).json({
//       message: "Delivery boy location updated",
//       location: deliveryBoy.location,
//     });
//   } catch (error) {
//     console.error("Update Delivery Boy Location Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// const goOnline = async (req, res) => {
//   try {
//     const deliveryBoy = await DeliveryBoy.findById(req.deliveryBoy.id);
//     if (!deliveryBoy) {
//       return res.status(404).json({ message: "Delivery boy not found" });
//     }

//     if (!deliveryBoy.isApproved) {
//       return res.status(403).json({ message: "Your account is not approved" });
//     }

//     deliveryBoy.isOnline = true;
//     deliveryBoy.isAvailable = true;
//     await deliveryBoy.save();

//     res.status(200).json({
//       message: "You are now online",
//       isOnline: true,
//     });
//   } catch (error) {
//     console.error("Go Online Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// const goOffline = async (req, res) => {
//   try {
//     const deliveryBoy = await DeliveryBoy.findById(req.deliveryBoy.id);
//     if (!deliveryBoy) {
//       return res.status(404).json({ message: "Delivery boy not found" });
//     }

//     deliveryBoy.isOnline = false;
//     await deliveryBoy.save();

//     res.status(200).json({
//       message: "You are now offline",
//       isOnline: false,
//     });
//   } catch (error) {
//     console.error("Go Offline Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // =====================================
// // ACCEPT DELIVERY (MULTIPLE ORDERS PERMITTED + ATOMIC LOCK)
// // =====================================
// const acceptDelivery = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const deliveryBoyId = req.deliveryBoy.id;

//     const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);
//     if (!deliveryBoy) {
//       return res.status(404).json({ message: "Delivery boy not found" });
//     }

//     if (!deliveryBoy.isApproved) {
//       return res.status(403).json({ message: "Your account is not approved" });
//     }

//     if (!deliveryBoy.isOnline) {
//       return res.status(400).json({ message: "Please go online first" });
//     }

//     // Atomic assignment: Only accept if order status is ready_for_shipping and unassigned
//     const order = await Order.findOneAndUpdate(
//       {
//         _id: orderId,
//         status: { $regex: /^ready[_ ]*for[_ ]*shipping$/i },
//         $or: [{ deliveryBoyId: null }, { deliveryBoyId: { $exists: false } }],
//       },
//       {
//         $set: {
//           deliveryBoyId: deliveryBoyId,
//           status: "assigned",
//           deliveryAcceptedAt: new Date(),
//         },
//       },
//       { new: true }
//     )
//       .populate("sellerId", "name phone storeAddress")
//       .populate("customerId", "name phone")
//       .populate("productId", "productName images price");

//     if (!order) {
//       return res.status(400).json({
//         message: "This order has already been accepted by another delivery boy",
//       });
//     }

//     const io = getIO();
//     if (io) {
//       // Customer notification
//       io.to(`customer_${order.customerId?._id || order.customerId}`).emit(
//         "deliveryBoyAssigned",
//         {
//           orderId: order._id,
//           deliveryBoyId: deliveryBoyId,
//           message: "A delivery boy has been assigned to your order",
//         }
//       );

//       // Seller notification
//       io.to(`seller_${order.sellerId?._id || order.sellerId}`).emit(
//         "deliveryBoyAssigned",
//         {
//           orderId: order._id,
//           deliveryBoyId: deliveryBoyId,
//           message: "A delivery boy has been assigned",
//         }
//       );

//       // Tell ALL delivery boys to immediately remove this card from available list
//       io.emit("orderTaken", {
//         orderId: order._id,
//         message: "Order taken by a delivery partner",
//       });
//     }

//     res.status(200).json({
//       message: "Delivery accepted successfully",
//       order,
//     });
//   } catch (error) {
//     console.error("Accept Delivery Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// const markPickedUp = async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     const order = await Order.findOne({
//       _id: orderId,
//       deliveryBoyId: req.deliveryBoy.id,
//     });

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     if (order.status !== "assigned") {
//       return res.status(400).json({ message: "Order cannot be marked as picked up" });
//     }

//     order.status = "picked_up";
//     await order.save();

//     const io = getIO();
//     if (io) {
//       io.emit("orderPickedUp", {
//         orderId: order._id,
//         message: "Order has been picked up",
//       });
//     }

//     res.status(200).json({
//       message: "Order picked up successfully",
//       order,
//     });
//   } catch (error) {
//     console.error("Picked Up Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// const markOutForDelivery = async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     const order = await Order.findOne({
//       _id: orderId,
//       deliveryBoyId: req.deliveryBoy.id,
//     });

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     if (order.status !== "picked_up") {
//       return res.status(400).json({ message: "Order is not picked up yet" });
//     }

//     order.status = "out_for_delivery";
//     await order.save();

//     const io = getIO();
//     if (io) {
//       io.emit("orderOutForDelivery", {
//         orderId: order._id,
//         message: "Order is out for delivery",
//       });
//     }

//     res.status(200).json({
//       message: "Order is out for delivery",
//       order,
//     });
//   } catch (error) {
//     console.error("Out For Delivery Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // const markDelivered = async (req, res) => {
// //   try {
// //     const { orderId } = req.params;

// //     const order = await Order.findOne({
// //       _id: orderId,
// //       deliveryBoyId: req.deliveryBoy.id,
// //     });

// //     if (!order) {
// //       return res.status(404).json({ message: "Order not found" });
// //     }

// //     order.status = "delivered";
// //     order.deliveredAt = new Date();
// //     await order.save();

// //     const io = getIO();
// //     if (io) {
// //       io.emit("orderDelivered", {
// //         orderId: order._id,
// //         message: "Order delivered successfully",
// //       });
// //     }

// //     res.status(200).json({
// //       message: "Order delivered successfully",
// //       order,
// //     });
// //   } catch (error) {
// //     console.error("Delivered Error:", error);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };


// // =====================================
// // MARK DELIVERED
// // =====================================
// const markDelivered = async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     const order = await Order.findOne({
//       _id: orderId,
//       deliveryBoyId: req.deliveryBoy.id,
//     });

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     // অর্ডার স্ট্যাটাস ও ডেলিভারির সময় সেট করা
//     order.status = "delivered";
//     order.deliveredAt = new Date();

//     // COD অর্ডারের ক্ষেত্রে ক্যাশ কালেকশন হওয়া মাত্রই পেমেন্ট স্ট্যাটাস 'paid' করা
//     if (order.paymentMethod === "COD") {
//       order.paymentStatus = "paid";
//       order.paidAt = new Date();
//     }

//     await order.save();

//     const io = getIO();
//     if (io) {
//       io.emit("orderDelivered", {
//         orderId: order._id,
//         message: "Order delivered successfully",
//       });
//     }

//     res.status(200).json({
//       message: "Order delivered successfully",
//       order,
//     });
//   } catch (error) {
//     console.error("Delivered Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };



// const getDeliveryBoyOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({
//       deliveryBoyId: req.deliveryBoy.id,
//     })
//       .populate("sellerId", "name phone storeAddress")
//       .populate("customerId", "name phone")
//       .populate("productId", "productName images price")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       message: "Delivery orders fetched successfully",
//       orders,
//     });
//   } catch (error) {
//     console.error("Get Delivery Boy Orders Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// const getDeliveryBoyEarnings = async (req, res) => {
//   try {
//     const result = await Order.aggregate([
//       {
//         $match: {
//           deliveryBoyId: req.deliveryBoy.id,
//           status: "delivered",
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalOrders: { $sum: 1 },
//           totalEarning: { $sum: "$deliveryBoyEarning" },
//         },
//       },
//     ]);

//     const data = result[0] || { totalOrders: 0, totalEarning: 0 };

//     res.status(200).json({
//       message: "Delivery boy earnings fetched successfully",
//       totalOrders: data.totalOrders,
//       totalEarning: data.totalEarning,
//     });
//   } catch (error) {
//     console.error("Get Delivery Boy Earnings Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// const getTodayEarnings = async (req, res) => {
//   try {
//     const startOfDay = new Date();
//     startOfDay.setHours(0, 0, 0, 0);

//     const endOfDay = new Date();
//     endOfDay.setHours(23, 59, 59, 999);

//     const result = await Order.aggregate([
//       {
//         $match: {
//           deliveryBoyId: req.deliveryBoy.id,
//           status: "delivered",
//           deliveredAt: { $gte: startOfDay, $lte: endOfDay },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalOrders: { $sum: 1 },
//           totalEarning: { $sum: "$deliveryBoyEarning" },
//         },
//       },
//     ]);

//     const data = result[0] || { totalOrders: 0, todayEarning: 0 };

//     res.status(200).json({
//       message: "Today's earnings fetched successfully",
//       totalOrders: data.totalOrders,
//       todayEarning: data.todayEarning,
//     });
//   } catch (error) {
//     console.error("Today's Earnings Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // =====================================
// // GET AVAILABLE ORDERS (WAITING FOR RIDER)
// // =====================================
// const getAvailableOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({
//       status: { $regex: /^ready[_ ]*for[_ ]*shipping$/i },
//       $or: [{ deliveryBoyId: null }, { deliveryBoyId: { $exists: false } }],
//     })
//       .populate("sellerId", "name phone storeAddress")
//       .populate("customerId", "name phone")
//       .populate("productId", "productName images price")
//       .sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       orders: orders || [],
//     });
//   } catch (error) {
//     console.error("Get Available Orders Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error: " + error.message,
//       orders: [],
//     });
//   }
// };

// module.exports = {
//   registerDeliveryBoy,
//   loginDeliveryBoy,
//   logoutDeliveryBoy,
//   isDeliveryBoyAuth,
//   approveDeliveryBoy,
//   updateDeliveryBoyLocation,
//   goOnline,
//   goOffline,
//   acceptDelivery,
//   markPickedUp,
//   markOutForDelivery,
//   markDelivered,
//   getDeliveryBoyOrders,
//   getDeliveryBoyEarnings,
//   getTodayEarnings,
//   getAvailableOrders,
// };






















const mongoose = require("mongoose");
const DeliveryBoy = require("../model/deliveryBoy");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Order = require("../model/order");
const { encrypt } = require("../utils/encryption");
const { getIO } = require("../config/socket");
const Notification = require("../model/deliveryNotification");

// =====================================
// REGISTRATION, LOGIN & AUTH
// =====================================
const registerDeliveryBoy = async (req, res) => {
  try {
    const { name, phone, password, aadhaarNumber } = req.body;

    if (!name || !phone || !password || !aadhaarNumber) {
      return res.status(400).json({
        message: "Name, phone, password, and Aadhaar number are required",
      });
    }

    const existingDeliveryBoy = await DeliveryBoy.findOne({ phone });
    if (existingDeliveryBoy) {
      return res.status(400).json({
        message: "Delivery boy already exists with this phone number",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const encryptedAadhaar = encrypt(aadhaarNumber);

    const deliveryBoy = await DeliveryBoy.create({
      name,
      phone,
      password: hashedPassword,
      aadhaarNumber: encryptedAadhaar,
      role: "deliveryBoy",
      isApproved: false,
      isOnline: false,
      isAvailable: true,
    });

    try {
      const io = getIO();
      if (io) {
        io.emit("newDeliveryBoy", {
          deliveryBoyId: deliveryBoy._id,
          name: deliveryBoy.name,
          phone: deliveryBoy.phone,
          message: "New delivery partner registration request",
        });
      }
    } catch (socketErr) {
      console.warn("Socket notification warning:", socketErr.message);
    }

    res.status(201).json({
      message: "Delivery partner registered successfully. Waiting for admin approval.",
      deliveryBoyId: deliveryBoy._id,
    });
  } catch (error) {
    console.error("Delivery Partner Register Error:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

const loginDeliveryBoy = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const deliveryBoy = await DeliveryBoy.findOne({ phone });
    if (!deliveryBoy) {
      return res.status(400).json({ message: "Delivery boy not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, deliveryBoy.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid password" });
    }

    if (!deliveryBoy.isApproved) {
      return res.status(403).json({
        message: "Your delivery boy account is not approved yet",
      });
    }

    const token = jwt.sign(
      { id: deliveryBoy._id, role: deliveryBoy.role },
      process.env.JWT_SECRET,
      { expiresIn: "6h" }
    );

    res.cookie("deliveryBoyToken", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 6 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Delivery boy logged in successfully",
      token,
      deliveryBoy: {
        id: deliveryBoy._id,
        _id: deliveryBoy._id,
        name: deliveryBoy.name,
        phone: deliveryBoy.phone,
        role: deliveryBoy.role,
        isOnline: deliveryBoy.isOnline,
      },
    });
  } catch (error) {
    console.error("Delivery Boy Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const logoutDeliveryBoy = async (req, res) => {
  try {
    res.clearCookie("deliveryBoyToken", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production",
    });

    if (req.deliveryBoy?.id) {
      await DeliveryBoy.findByIdAndUpdate(req.deliveryBoy.id, { isOnline: false });
    }

    res.status(200).json({ message: "Delivery boy logged out successfully" });
  } catch (error) {
    console.error("Delivery Boy Logout Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const isDeliveryBoyAuth = async (req, res) => {
  try {
    const deliveryBoy = await DeliveryBoy.findById(req.deliveryBoy.id).select(
      "-password -aadhaarNumber"
    );

    if (!deliveryBoy) {
      return res.status(404).json({ message: "Delivery boy not found" });
    }

    res.status(200).json({ deliveryBoy });
  } catch (error) {
    console.error("Delivery Boy Auth Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const approveDeliveryBoy = async (req, res) => {
  try {
    const { deliveryBoyId } = req.params;
    const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);

    if (!deliveryBoy) {
      return res.status(404).json({ message: "Delivery boy not found" });
    }

    deliveryBoy.isApproved = true;
    await deliveryBoy.save();

    await Notification.create({
      deliveryBoyId: deliveryBoy._id,
      type: "delivery_boy_approved",
      message: "Your delivery boy account has been approved. You can login now.",
      isRead: false,
    });

    const io = getIO();
    if (io) {
      io.to(`deliveryBoy_${deliveryBoy._id}`).emit("deliveryBoyApproved", {
        message: "Your delivery boy account has been approved. You can login now.",
      });
    }

    res.status(200).json({ message: "Delivery boy approved successfully", deliveryBoyId: deliveryBoy._id });
  } catch (error) {
    console.error("Approve Delivery Boy Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateDeliveryBoyLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({ message: "Valid latitude and longitude are required" });
    }

    const deliveryBoy = await DeliveryBoy.findById(req.deliveryBoy.id);
    if (!deliveryBoy) {
      return res.status(404).json({ message: "Delivery boy not found" });
    }

    deliveryBoy.location = { latitude: lat, longitude: lng };
    await deliveryBoy.save();

    const io = getIO();
    if (io && deliveryBoy.isOnline) {
      io.emit("deliveryBoyLocationUpdated", {
        deliveryBoyId: deliveryBoy._id,
        latitude: lat,
        longitude: lng,
      });
    }

    res.status(200).json({ message: "Delivery boy location updated", location: deliveryBoy.location });
  } catch (error) {
    console.error("Update Delivery Boy Location Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const goOnline = async (req, res) => {
  try {
    const deliveryBoy = await DeliveryBoy.findById(req.deliveryBoy.id);
    if (!deliveryBoy) return res.status(404).json({ message: "Delivery boy not found" });

    deliveryBoy.isOnline = true;
    deliveryBoy.isAvailable = true;
    await deliveryBoy.save();

    res.status(200).json({ message: "You are now online", isOnline: true });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const goOffline = async (req, res) => {
  try {
    const deliveryBoy = await DeliveryBoy.findById(req.deliveryBoy.id);
    if (!deliveryBoy) return res.status(404).json({ message: "Delivery boy not found" });

    deliveryBoy.isOnline = false;
    await deliveryBoy.save();

    res.status(200).json({ message: "You are now offline", isOnline: false });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// =====================================
// ORDER STATUS MANAGEMENT
// =====================================
const acceptDelivery = async (req, res) => {
  try {
    const { orderId } = req.params;
    const deliveryBoyId = req.deliveryBoy.id;

    const order = await Order.findOneAndUpdate(
      {
        _id: orderId,
        status: { $regex: /^ready[_ ]*for[_ ]*shipping$/i },
        $or: [{ deliveryBoyId: null }, { deliveryBoyId: { $exists: false } }],
      },
      {
        $set: {
          deliveryBoyId: deliveryBoyId,
          status: "assigned",
          deliveryAcceptedAt: new Date(),
        },
      },
      { new: true }
    )
      .populate("sellerId", "name phone storeAddress")
      .populate("customerId", "name phone")
      .populate("productId", "productName images price");

    if (!order) {
      return res.status(400).json({ message: "This order has already been accepted" });
    }

    const io = getIO();
    if (io) {
      io.to(`customer_${order.customerId?._id || order.customerId}`).emit("deliveryBoyAssigned", {
        orderId: order._id,
        deliveryBoyId,
        message: "A delivery boy has been assigned to your order",
      });
      io.to(`seller_${order.sellerId?._id || order.sellerId}`).emit("deliveryBoyAssigned", {
        orderId: order._id,
        deliveryBoyId,
        message: "A delivery boy has been assigned",
      });
      io.emit("orderTaken", { orderId: order._id });
    }

    res.status(200).json({ message: "Delivery accepted successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const markPickedUp = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ _id: orderId, deliveryBoyId: req.deliveryBoy.id });

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "picked_up";
    await order.save();

    const io = getIO();
    if (io) {
      io.emit("orderPickedUp", { orderId: order._id, message: "Order has been picked up" });
    }

    res.status(200).json({ message: "Order picked up successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const markOutForDelivery = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ _id: orderId, deliveryBoyId: req.deliveryBoy.id });

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "out_for_delivery";
    await order.save();

    const io = getIO();
    if (io) {
      io.emit("orderOutForDelivery", { orderId: order._id, message: "Order is out for delivery" });
    }

    res.status(200).json({ message: "Order is out for delivery", order });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const markDelivered = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ _id: orderId, deliveryBoyId: req.deliveryBoy.id });

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "delivered";
    order.deliveredAt = new Date();

    if (order.paymentMethod === "COD") {
      order.paymentStatus = "paid";
      order.paidAt = new Date();
    }

    await order.save();

    const io = getIO();
    if (io) {
      io.emit("orderDelivered", { orderId: order._id, message: "Order delivered successfully" });
    }

    res.status(200).json({ message: "Order delivered successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getDeliveryBoyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ deliveryBoyId: req.deliveryBoy.id })
      .populate("sellerId", "name phone storeAddress")
      .populate("customerId", "name phone")
      .populate("productId", "productName images price")
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Delivery orders fetched successfully", orders });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// =====================================
// EARNINGS CALCULATION (TODAY, THIS WEEK, TOTAL)
// =====================================
const getDeliveryBoyEarnings = async (req, res) => {
  try {
    const riderObjectId = new mongoose.Types.ObjectId(req.deliveryBoy.id);

    // ১. আজকের রেঞ্জ
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // ২. বর্তমান সপ্তাহের শুরু (সোমবার / রবিবার থেকে)
    const startOfWeek = new Date();
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // সোমবার থেকে হিসাব
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    // ৩. অ্যাগ্রিগেশন পাইপলাইন
    const [todayRes, weekRes, totalRes] = await Promise.all([
      // আজকের হিসাব
      Order.aggregate([
        {
          $match: {
            deliveryBoyId: riderObjectId,
            status: "delivered",
            deliveredAt: { $gte: startOfDay, $lte: endOfDay },
          },
        },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalEarning: { $sum: "$deliveryBoyEarning" },
          },
        },
      ]),

      // এই সপ্তাহের হিসাব
      Order.aggregate([
        {
          $match: {
            deliveryBoyId: riderObjectId,
            status: "delivered",
            deliveredAt: { $gte: startOfWeek, $lte: endOfDay },
          },
        },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalEarning: { $sum: "$deliveryBoyEarning" },
          },
        },
      ]),

      // সর্বমোট হিসাব
      Order.aggregate([
        {
          $match: {
            deliveryBoyId: riderObjectId,
            status: "delivered",
          },
        },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalEarning: { $sum: "$deliveryBoyEarning" },
          },
        },
      ]),
    ]);

    const todayData = todayRes[0] || { totalOrders: 0, totalEarning: 0 };
    const weekData = weekRes[0] || { totalOrders: 0, totalEarning: 0 };
    const allData = totalRes[0] || { totalOrders: 0, totalEarning: 0 };

    // বোনাস হিসাব (উদাহরণ: সপ্তাহে ১০টির বেশি ডেলিভারি হলে ₹১০০ বোনাস)
    const weekBonus = weekData.totalOrders >= 10 ? 100 : 0;

    res.status(200).json({
      success: true,
      today: {
        earnings: todayData.totalEarning,
        deliveries: todayData.totalOrders,
      },
      thisWeek: {
        earnings: weekData.totalEarning,
        deliveries: weekData.totalOrders,
        bonus: weekBonus,
      },
      allTime: {
        earnings: allData.totalEarning,
        deliveries: allData.totalOrders,
      },
    });
  } catch (error) {
    console.error("Get Delivery Boy Earnings Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getTodayEarnings = async (req, res) => {
  return getDeliveryBoyEarnings(req, res);
};

const getAvailableOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      status: { $regex: /^ready[_ ]*for[_ ]*shipping$/i },
      $or: [{ deliveryBoyId: null }, { deliveryBoyId: { $exists: false } }],
    })
      .populate("sellerId", "name phone storeAddress")
      .populate("customerId", "name phone")
      .populate("productId", "productName images price")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, orders: orders || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", orders: [] });
  }
};

module.exports = {
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
  getAvailableOrders,
};