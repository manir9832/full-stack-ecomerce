
// const crypto = require("crypto");

// const razorpay = require("../config/razorpay");
// const Order = require("../model/order");

// // =====================================
// // CREATE RAZORPAY ORDER
// // =====================================

// const createRazorpayOrder = async (req, res) => {
//     try {
//         const { amount } = req.body;

//         // Check amount
//         if (
//             amount === undefined ||
//             Number(amount) <= 0
//         ) {
//             return res.status(400).json({
//                 message: "Valid amount is required",
//             });
//         }

//         // Convert rupees to paise
//         const amountInPaise = Math.round(
//             Number(amount) * 100
//         );

//         // Create Razorpay order
//         const razorpayOrder =
//             await razorpay.orders.create({
//                 amount: amountInPaise,

//                 currency: "INR",

//                 receipt:
//                     `receipt_${Date.now()}`,

//                 payment_capture: 1,
//             });

//         res.status(200).json({
//             message:
//                 "Razorpay order created successfully",

//             order: razorpayOrder,

//             key:
//                 process.env.RAZORPAY_API_KEY_ID,
//         });

//     } catch (error) {
//         console.error(
//             "Create Razorpay Order Error:",
//             error
//         );

//         res.status(500).json({
//             message: "Server error",
//         });
//     }
// };


// // =====================================
// // VERIFY RAZORPAY PAYMENT
// // =====================================

// const verifyPayment = async (req, res) => {
//     try {
//         const {
//             razorpay_order_id,
//             razorpay_payment_id,
//             razorpay_signature,
//         } = req.body;

//         // Required fields
//         if (
//             !razorpay_order_id ||
//             !razorpay_payment_id ||
//             !razorpay_signature
//         ) {
//             return res.status(400).json({
//                 message:
//                     "Payment verification details are required",
//             });
//         }

//         // =====================================
//         // GENERATE SIGNATURE
//         // =====================================

//         const generatedSignature =
//             crypto
//                 .createHmac(
//                     "sha256",
//                     process.env.RAZORPAY_KEY_SECRET
//                 )
//                 .update(
//                     razorpay_order_id +
//                     "|" +
//                     razorpay_payment_id
//                 )
//                 .digest("hex");

//         // =====================================
//         // VERIFY SIGNATURE
//         // =====================================

//         if (
//             generatedSignature !==
//             razorpay_signature
//         ) {
//             return res.status(400).json({
//                 message:
//                     "Payment verification failed",
//             });
//         }

//         // =====================================
//         // FIND ORDER
//         // =====================================

//         const order = await Order.findOne({
//             razorpayOrderId:
//                 razorpay_order_id,
//         });

//         if (!order) {
//             return res.status(404).json({
//                 message:
//                     "Order not found",
//             });
//         }

//         // =====================================
//         // CHECK ORDER OWNER
//         // =====================================

//         if (
//             order.customerId.toString() !==
//             req.user.id.toString()
//         ) {
//             return res.status(403).json({
//                 message:
//                     "You are not authorized to update this order",
//             });
//         }

//         // =====================================
//         // ALREADY PAID
//         // =====================================

//         if (
//             order.paymentStatus === "paid"
//         ) {
//             return res.status(400).json({
//                 message:
//                     "Order payment is already completed",
//             });
//         }

//         // =====================================
//         // UPDATE ORDER PAYMENT
//         // =====================================

//         order.paymentStatus = "paid";

//         order.razorpayPaymentId =
//             razorpay_payment_id;

//         order.paidAt = new Date();

//         await order.save();

//         // =====================================
//         // SUCCESS RESPONSE
//         // =====================================

//         res.status(200).json({
//             message:
//                 "Payment verified successfully",

//             orderId:
//                 order._id,

//             paymentId:
//                 razorpay_payment_id,

//             razorpayOrderId:
//                 razorpay_order_id,

//             paymentStatus:
//                 order.paymentStatus,

//             paidAt:
//                 order.paidAt,
//         });

//     } catch (error) {
//         console.error(
//             "Payment Verification Error:",
//             error
//         );

//         res.status(500).json({
//             message: "Server error",
//         });
//     }
// };


// // =====================================
// // EXPORT
// // =====================================

// module.exports = {
//     createRazorpayOrder,
//     verifyPayment,
// };


const crypto = require("crypto");

const razorpay = require("../config/razorpay");
const Order = require("../model/order");

// =====================================
// CREATE RAZORPAY ORDER
// =====================================

const createRazorpayOrder = async (req, res) => {
    try {

        const { orderId } =
            req.body;

        if (!orderId) {
            return res.status(400).json({
                message:
                    "Order ID is required",
            });
        }

        // =====================================
        // FIND ORDER
        // =====================================

        const order =
            await Order.findOne({
                _id: orderId,

                customerId:
                    req.user.id,
            });

        if (!order) {
            return res.status(404).json({
                message:
                    "Order not found",
            });
        }

        // =====================================
        // CHECK PAYMENT METHOD
        // =====================================

        if (
            order.paymentMethod !==
            "ONLINE"
        ) {
            return res.status(400).json({
                message:
                    "This order is not an online payment order",
            });
        }

        // =====================================
        // ALREADY PAID
        // =====================================

        if (
            order.paymentStatus ===
            "paid"
        ) {
            return res.status(400).json({
                message:
                    "Order is already paid",
            });
        }

        // =====================================
        // EXISTING RAZORPAY ORDER
        // =====================================

        if (
            order.razorpayOrderId
        ) {

            return res.status(200).json({

                message:
                    "Razorpay order already exists",

                orderId:
                    order._id,

                razorpayOrderId:
                    order.razorpayOrderId,

                amount:
                    Math.round(
                        order.totalAmount *
                        100
                    ),

                currency:
                    "INR",

                key:
                    process.env
                        .RAZORPAY_API_KEY_ID,
            });
        }

        // =====================================
        // AMOUNT
        // =====================================

        const amountInPaise =
            Math.round(
                order.totalAmount *
                100
            );

        // =====================================
        // CREATE RAZORPAY ORDER
        // =====================================

        const razorpayOrder =
            await razorpay.orders.create({

                amount:
                    amountInPaise,

                currency:
                    "INR",

                receipt:
                    `order_${order._id}`,

                payment_capture:
                    1,
            });

        // =====================================
        // SAVE RAZORPAY ORDER ID
        // =====================================

        order.razorpayOrderId =
            razorpayOrder.id;

        await order.save();

        // =====================================
        // RESPONSE
        // =====================================

        res.status(200).json({

            message:
                "Razorpay order created successfully",

            orderId:
                order._id,

            razorpayOrderId:
                razorpayOrder.id,

            amount:
                razorpayOrder.amount,

            currency:
                razorpayOrder.currency,

            key:
                process.env
                    .RAZORPAY_API_KEY_ID,
        });

    } catch (error) {

        console.error(
            "Create Razorpay Order Error:",
            error
        );

        res.status(500).json({
            message:
                "Unable to create Razorpay order",
        });
    }
};


// =====================================
// VERIFY RAZORPAY PAYMENT
// =====================================

const verifyPayment = async (
    req,
    res
) => {
    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        // =====================================
        // REQUIRED FIELDS
        // =====================================

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                message:
                    "Payment verification details are required",
            });
        }

        // =====================================
        // FIND ORDER
        // =====================================

        const order =
            await Order.findOne({

                razorpayOrderId:
                    razorpay_order_id,

                customerId:
                    req.user.id,
            });

        if (!order) {
            return res.status(404).json({
                message:
                    "Order not found",
            });
        }

        // =====================================
        // CHECK ONLINE PAYMENT
        // =====================================

        if (
            order.paymentMethod !==
            "ONLINE"
        ) {
            return res.status(400).json({
                message:
                    "This is not an online payment order",
            });
        }

        // =====================================
        // ALREADY PAID
        // =====================================

        if (
            order.paymentStatus ===
            "paid"
        ) {
            return res.status(400).json({
                message:
                    "Payment is already completed",
            });
        }

        // =====================================
        // GENERATE SIGNATURE
        // =====================================

        const generatedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env
                        .RAZORPAY_KEY_SECRET
                )
                .update(
                    razorpay_order_id +
                    "|" +
                    razorpay_payment_id
                )
                .digest("hex");

        // =====================================
        // COMPARE SIGNATURE
        // =====================================

        if (
            generatedSignature !==
            razorpay_signature
        ) {

            order.paymentStatus =
                "failed";

            await order.save();

            return res.status(400).json({
                message:
                    "Payment verification failed",
            });
        }

        // =====================================
        // PAYMENT SUCCESS
        // =====================================

        order.paymentStatus =
            "paid";

        order.razorpayPaymentId =
            razorpay_payment_id;

        order.paidAt =
            new Date();

        await order.save();

        // =====================================
        // REDUCE STOCK
        // =====================================

        const SellerProduct =
            require("../model/sellerProduct");

        const product =
            await SellerProduct.findById(
                order.productId
            );

        if (!product) {

            return res.status(404).json({
                message:
                    "Product not found after payment",
            });
        }

        // Check stock again
        if (
            product.stock <
            order.quantity
        ) {

            // Payment is already successful.
            // Do NOT mark payment failed.

            return res.status(409).json({
                message:
                    "Payment successful, but product stock is no longer available. Contact support.",
                
                paymentStatus:
                    "paid",

                orderId:
                    order._id,
            });
        }

        product.stock -=
            order.quantity;

        await product.save();

        // =====================================
        // RESPONSE
        // =====================================

        res.status(200).json({

            message:
                "Payment verified successfully",

            orderId:
                order._id,

            paymentId:
                razorpay_payment_id,

            razorpayOrderId:
                razorpay_order_id,

            paymentStatus:
                order.paymentStatus,

            paidAt:
                order.paidAt,
        });

    } catch (error) {

        console.error(
            "Payment Verification Error:",
            error
        );

        res.status(500).json({
            message:
                "Server error",
        });
    }
};


// =====================================
// EXPORT
// =====================================

module.exports = {

    createRazorpayOrder,

    verifyPayment,
};