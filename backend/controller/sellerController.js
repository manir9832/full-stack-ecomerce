console.log("SELLER approveSeller called");
const Seller = require("../model/seller");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { encrypt } = require("../utils/encryption");
const { getIO } = require("../config/socket")
const Notification = require("../model/sellerNotification");

const Order = require("../model/order");
const SellerProduct = require("../model/sellerProduct");


const registerSeller = async (req, res) => {
    try {
        const {
            name,
            shopName,
            phone,
            password,
            aadhaarNumber
        } = req.body;

        // name অথবা shopName যেকোনো একটি রিসিভ করার ব্যবস্থা
        const sellerName = name || shopName;

        // ১. আবশ্যিক ফিল্ড চেক (যাতে bcrypt ক্র্যাশ না করে)
        if (!sellerName || !phone || !password || !aadhaarNumber) {
            return res.status(400).json({
                message: "সকল তথ্য (নাম, ফোন, পাসওয়ার্ড, আধার নম্বর) প্রদান করা বাধ্যতামূলক।"
            });
        }

        // Check seller already exists
        const existingSeller = await Seller.findOne({ phone });

        if (existingSeller) {
            return res.status(400).json({
                message: "Seller already exists with this phone number"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        // Encrypt Aadhaar number
        const encryptedAadhaar = encrypt(aadhaarNumber);

        // Create seller
        const seller = await Seller.create({
            name: sellerName,
            phone,
            password: hashedPassword,
            aadhaarNumber: encryptedAadhaar,
            role: "seller",
            isPhoneVerified: true,
            isApproved: false
        });

        // 🔔 Notify Admin about new seller
        const io = getIO();
        if (io) {
            io.emit("newSeller", {
                sellerId: seller._id,
                name: seller.name,
                phone: seller.phone,
                message: "New seller registration request"
            });
        }

        res.status(201).json({
            message: "Seller registered successfully. Waiting for admin approval.",
            sellerId: seller._id
        });

    } catch (error) {
        console.error("Seller Registration Error:", error);

        res.status(500).json({
            message: "Server error: " + error.message
        });
    }
};








const loginSeller = async (req, res) => {
    try {
        const { phone, password } = req.body;

        // Find seller
        const seller = await Seller.findOne({ phone });

        if (!seller) {
            return res.status(400).json({
                message: "Seller not found",
            });
        }

        // Check password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            seller.password
        );

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid password",
            });
        }

        // Check phone verification
        if (!seller.isPhoneVerified) {
            return res.status(403).json({
                message: "Please verify your phone number",
            });
        }

        // Check admin approval
        if (!seller.isApproved) {
            return res.status(403).json({
                message: "Your seller account is not approved yet",
            });
        }

        // Create JWT
        const token = jwt.sign(
            {
                id: seller._id,
                role: seller.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "6h",
            }
        );

        // Store token in cookie
        res.cookie("sellerToken", token, {
            httpOnly: true,
            sameSite:
                process.env.NODE_ENV === "production"
                    ? "none"
                    : "strict",
            secure:
                process.env.NODE_ENV === "production",
            maxAge: 6 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "Seller logged in successfully",
            seller: {
                id: seller._id,
                name: seller.name,
                phone: seller.phone,
                role: seller.role,
            },
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

const logoutSeller = async (req, res) => {
    try {
        res.clearCookie("sellerToken", {
            httpOnly: true,
            sameSite:
                process.env.NODE_ENV === "production"
                    ? "none"
                    : "strict",
            secure:
                process.env.NODE_ENV === "production",
        });

        res.status(200).json({
            message: "Seller logged out successfully",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

const isSellerAuth = async (req, res) => {
    try {
        const seller = await Seller.findById(req.seller.id)
            .select("-password -aadhaarNumber");

        if (!seller) {
            return res.status(404).json({
                message: "Seller not found",
            });
        }

        res.status(200).json({
            seller,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

const approveSeller = async (req, res) => {
    try {
        const { sellerId } = req.params;

        const seller = await Seller.findById(sellerId);

        if (!seller) {
            return res.status(404).json({
                message: "Seller not found"
            });
        }

        // Already approved?
        if (seller.isApproved) {
            return res.status(400).json({
                message: "Seller is already approved"
            });
        }

        // Approve seller
        seller.isApproved = true;

        await seller.save();

        // Create notification in database
        const notification = await Notification.create({
            sellerId: seller._id,
            type: "seller_approved",
            message:
                "Your seller account has been approved. You can login now.",
            isRead: false
        });

        // Send live notification to seller
        const io = getIO();

        io.to(`seller_${seller._id}`).emit(
            "sellerApproved",
            {
                message:
                    "Your seller account has been approved. You can login now."
            }
        );

        res.status(200).json({
            message: "Seller approved successfully",
            sellerId: seller._id
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const updateStoreLocation = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;

        if (
            latitude === undefined ||
            longitude === undefined
        ) {
            return res.status(400).json({
                message: "Latitude and longitude are required"
            });
        }

        const seller = await Seller.findById(req.seller.id);

        if (!seller) {
            return res.status(404).json({
                message: "Seller not found"
            });
        }

        seller.location = {
            latitude: Number(latitude),
            longitude: Number(longitude)
        };

        await seller.save();

        res.status(200).json({
            message: "Store location saved successfully",
            location: seller.location
        });

    } catch (error) {
        console.error(
            "Update Store Location Error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};
// =====================================
// GET SELLER DASHBOARD STATS & EARNINGS
// =====================================
const getSellerDashboardStats = async (req, res) => {
    try {
        const sellerId = req.seller.id;

        // ১. মোট প্রোডাক্ট ও লো স্টক সংখ্যা
        const totalProducts = await SellerProduct.countDocuments({ sellerId });
        const lowStockProducts = await SellerProduct.countDocuments({
            sellerId,
            stock: { $lt: 10 }
        });

        // ২. সেলারের সব অর্ডার ফেচ করা
        const orders = await Order.find({ sellerId });

        // ৩. মোট অর্ডার ও পেন্ডিং অর্ডার
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(o => o.status === "pending").length;

        // ৪. সেলারের মোট আয় (Delivered অর্ডার অথবা পেইড অর্ডারের প্রোডাক্টের মূল্য)
        const totalEarnings = orders
            .filter(o => o.status === "delivered" || o.paymentStatus === "paid")
            .reduce((sum, o) => sum + (o.productTotal || 0), 0);

        res.status(200).json({
            success: true,
            stats: {
                totalEarnings,
                totalOrders,
                pendingOrders,
                totalProducts,
                lowStockProducts
            }
        });
    } catch (error) {
        console.error("Seller Stats Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error: " + error.message
        });
    }
};

module.exports = {
    registerSeller,
    loginSeller,
    logoutSeller,
    isSellerAuth,
    approveSeller,
    updateStoreLocation,
    getSellerDashboardStats
};



    