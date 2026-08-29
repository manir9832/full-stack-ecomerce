
console.log("ADMIN approveSeller called");
const Admin = require("../model/admin");
const Seller = require("../model/seller");
const DeliveryBoy = require("../model/deliveryBoy");
const Order = require("../model/order");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// =====================================
// ADMIN LOGIN
// =====================================

const loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find admin
        const admin = await Admin.findOne({
            email: email.toLowerCase()
        });

        if (!admin) {
            return res.status(400).json({
                message: "Admin not found"
            });
        }

        // Check password
        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                admin.password
            );

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        // Create JWT
        const token = jwt.sign(
            {
                id: admin._id,
                role: admin.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "6h"
            }
        );

        // Store token in cookie
        res.cookie(
            "adminToken",
            token,
            {
                httpOnly: true,

                sameSite:
                    process.env.NODE_ENV === "production"
                        ? "none"
                        : "strict",

                secure:
                    process.env.NODE_ENV === "production",

                maxAge:
                    6 * 60 * 60 * 1000
            }
        );

        res.status(200).json({

            message:
                "Admin logged in successfully",

            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error) {

        console.error(
            "Admin Login Error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =====================================
// ADMIN LOGOUT
// =====================================

const logoutAdmin = async (req, res) => {
    try {

        res.clearCookie(
            "adminToken",
            {
                httpOnly: true,

                sameSite:
                    process.env.NODE_ENV === "production"
                        ? "none"
                        : "strict",

                secure:
                    process.env.NODE_ENV === "production"
            }
        );

        res.status(200).json({
            message:
                "Admin logged out successfully"
        });

    } catch (error) {

        console.error(
            "Admin Logout Error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =====================================
// ADMIN AUTH CHECK
// =====================================

const isAdminAuth = async (req, res) => {
    try {

        const admin =
            await Admin.findById(
                req.admin.id
            ).select("-password");

        if (!admin) {
            return res.status(404).json({
                message: "Admin not found"
            });
        }

        res.status(200).json({
            admin
        });

    } catch (error) {

        console.error(
            "Admin Auth Error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =====================================
// GET ALL SELLERS
// =====================================

// const getAllSellers = async (req, res) => {
//     try {

//         const sellers =
//             await Seller.find()
//                 .select("-password -aadhaarNumber")
//                 .sort({
//                     createdAt: -1
//                 });

//         res.status(200).json({

//             message:
//                 "Sellers fetched successfully",

//             sellers
//         });

//     } catch (error) {

//         console.error(
//             "Get Sellers Error:",
//             error
//         );

//         res.status(500).json({
//             message: "Server error"
//         });
//     }
// };



const getAllSellers = async (req, res) => {
  try {
    // শুধুমাত্র পাসওয়ার্ড বাদ দিয়ে সব ডাটা ফেচ করা
    const sellers = await Seller.find()
      .select("-password")
      .sort({ createdAt: -1 });

    console.log("Total sellers found in DB:", sellers.length);

    res.status(200).json({
      success: true,
      message: "Sellers fetched successfully",
      sellers: sellers || []
    });
  } catch (error) {
    console.error("Get Sellers Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
};





// =====================================
// APPROVE SELLER
// =====================================

// const approveSeller = async (req, res) => {
//     try {

//         const { sellerId } = req.params;

//         const seller =
//             await Seller.findById(
//                 sellerId
//             );

//         if (!seller) {
//             return res.status(404).json({
//                 message: "Seller not found"
//             });
//         }

//         if (seller.isApproved) {
//             return res.status(400).json({
//                 message:
//                     "Seller is already approved"
//             });
//         }

//         seller.isApproved = true;

//         await seller.save();

//         res.status(200).json({

//             message:
//                 "Seller approved successfully",

//             sellerId:
//                 seller._id
//         });

//     } catch (error) {

//         console.error(
//             "Approve Seller Error:",
//             error
//         );

//         res.status(500).json({
//             message: "Server error"
//         });
//     }
// };











const approveSeller = async (req, res) => {
    try {
        const { sellerId } = req.params;

        console.log("====================================");
        console.log("Approve request for seller:", sellerId);

        const seller = await Seller.findById(sellerId);

        console.log("Seller found:", seller);

        if (!seller) {
            return res.status(404).json({
                message: "Seller not found"
            });
        }

        console.log("Seller Object:", seller.toObject());

        if (seller.isApproved) {
            return res.status(400).json({
                message: "Seller is already approved"
            });
        }

        seller.isApproved = true;

        console.log("Before save:", seller);

        await seller.save();

        console.log("Seller approved successfully");

        res.status(200).json({
            message: "Seller approved successfully",
            sellerId: seller._id
        });

    } catch (error) {
        console.error("Approve Seller Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};






// =====================================
// GET ALL DELIVERY BOYS
// =====================================

const getAllDeliveryBoys = async (
    req,
    res
) => {
    try {

        const deliveryBoys =
            await DeliveryBoy.find()
                .select(
                    "-password -aadhaarNumber"
                )
                .sort({
                    createdAt: -1
                });

        res.status(200).json({

            message:
                "Delivery boys fetched successfully",

            deliveryBoys
        });

    } catch (error) {

        console.error(
            "Get Delivery Boys Error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =====================================
// APPROVE DELIVERY BOY
// =====================================

const approveDeliveryBoy = async (
    req,
    res
) => {
    try {

        const {
            deliveryBoyId
        } = req.params;

        const deliveryBoy =
            await DeliveryBoy.findById(
                deliveryBoyId
            );

        if (!deliveryBoy) {
            return res.status(404).json({
                message:
                    "Delivery boy not found"
            });
        }

        if (deliveryBoy.isApproved) {
            return res.status(400).json({
                message:
                    "Delivery boy is already approved"
            });
        }

        deliveryBoy.isApproved = true;

        await deliveryBoy.save();

        res.status(200).json({

            message:
                "Delivery boy approved successfully",

            deliveryBoyId:
                deliveryBoy._id
        });

    } catch (error) {

        console.error(
            "Approve Delivery Boy Error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =====================================
// GET ALL ORDERS
// =====================================

const getAllOrders = async (req, res) => {
    try {

        const orders =
            await Order.find()
                .populate(
                    "customerId",
                    "name phone"
                )
                .populate(
                    "sellerId",
                    "name phone"
                )
                .populate(
                    "deliveryBoyId",
                    "name phone"
                )
                .populate(
                    "productId",
                    "productName images"
                )
                .sort({
                    createdAt: -1
                });

        res.status(200).json({

            message:
                "All orders fetched successfully",

            orders
        });

    } catch (error) {

        console.error(
            "Get All Orders Error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =====================================
// EXPORT
// =====================================

module.exports = {

    loginAdmin,

    logoutAdmin,

    isAdminAuth,

    getAllSellers,

    approveSeller,

    getAllDeliveryBoys,

    approveDeliveryBoy,

    getAllOrders

};
