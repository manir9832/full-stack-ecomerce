


const Order = require("../model/order");
const SellerProduct = require("../model/sellerProduct");
const Seller = require("../model/seller");
const DeliveryBoy = require("../model/deliveryBoy");

const razorpay = require("../config/razorpay");
const getRoadDistance = require("../utils/roadDistance");
const calculateDeliveryCharge = require("../utils/deliveryCharge");
const { getIO } = require("../config/socket");

// =====================================
// CREATE ORDER
// =====================================
const createOrder = async (req, res) => {
  try {
    const { productId, quantity, shippingAddress, paymentMethod, customerLocation } = req.body;

    if (!productId || !quantity || !shippingAddress || !customerLocation) {
      return res.status(400).json({
        message: "Please provide all required order details",
      });
    }

    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0" });
    }

    const selectedPaymentMethod = paymentMethod === "ONLINE" ? "ONLINE" : "COD";
    const customerLatitude = Number(customerLocation.latitude);
    const customerLongitude = Number(customerLocation.longitude);

    if (!Number.isFinite(customerLatitude) || !Number.isFinite(customerLongitude)) {
      return res.status(400).json({ message: "Valid customer location is required" });
    }

    const product = await SellerProduct.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (!product.isActive) {
      return res.status(400).json({ message: "This product is currently unavailable" });
    }

    if (product.stock < qty) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    const seller = await Seller.findById(product.sellerId);
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    const sellerLatitude = Number(seller.location?.latitude || 22.6401);
    const sellerLongitude = Number(seller.location?.longitude || 88.6795);

    const sellingPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
    const productTotal = sellingPrice * qty;

    const distanceKm = await getRoadDistance(
      sellerLatitude,
      sellerLongitude,
      customerLatitude,
      customerLongitude
    );

    const deliveryCharge = calculateDeliveryCharge(distanceKm);
    const platformCharge = 0;
    const deliveryBoyEarning = deliveryCharge;
    const totalAmount = productTotal + deliveryCharge + platformCharge;

    const order = await Order.create({
      customerId: req.user?.id || req.user?._id,
      sellerId: product.sellerId,
      productId: product._id,
      productName: product.productName,
      quantity: qty,
      price: sellingPrice,
      productTotal,
      distanceKm,
      deliveryCharge,
      deliveryBoyEarning,
      platformCharge,
      totalAmount,
      shippingAddress,
      paymentMethod: selectedPaymentMethod,
      paymentStatus: "pending",
      status: "pending",
      sellerLocation: { latitude: sellerLatitude, longitude: sellerLongitude },
      customerLocation: { latitude: customerLatitude, longitude: customerLongitude },
    });

    try {
      const io = getIO();
      if (io) {
        const sellerIdStr = String(product.sellerId);
        const orderAlertData = {
          _id: order._id,
          orderId: order._id,
          sellerId: sellerIdStr,
          productName: order.productName,
          quantity: order.quantity,
          productTotal: order.productTotal,
          customerName: req.user?.name || "Customer",
          message: "New order received!",
        };

        io.to(`seller_${sellerIdStr}`).emit("newOrderAlert", orderAlertData);
        io.to(`seller_${sellerIdStr}`).emit("new_order_notification", orderAlertData);
        io.emit("globalNewOrder", orderAlertData);
      }
    } catch (socketErr) {
      console.warn("Socket notification warning:", socketErr.message);
    }

    if (selectedPaymentMethod === "ONLINE") {
      try {
        const amountInPaise = Math.round(totalAmount * 100);
        const razorpayOrder = await razorpay.orders.create({
          amount: amountInPaise,
          currency: "INR",
          receipt: `order_${order._id}`,
          payment_capture: 1,
        });

        order.razorpayOrderId = razorpayOrder.id;
        await order.save();

        return res.status(201).json({
          message: "Order created. Proceed with online payment.",
          order,
          razorpayOrder: {
            id: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
          },
          razorpayKey: process.env.RAZORPAY_API_KEY_ID,
        });
      } catch (razorpayError) {
        console.error("Razorpay Order Error:", razorpayError);
        await Order.findByIdAndDelete(order._id);
        return res.status(500).json({ message: "Unable to create Razorpay order" });
      }
    }

    product.stock -= qty;
    await product.save();

    return res.status(201).json({
      message: "COD order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =====================================
// GET CUSTOMER ORDERS
// =====================================
const getMyOrders = async (req, res) => {
  try {
    const customerId = req.user?.id || req.user?._id;
    const orders = await Order.find({ customerId })
      .populate("sellerId", "name phone storeAddress")
      .populate("productId", "productName images price")
      .populate("deliveryBoyId", "name phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders: orders || [],
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);
    res.status(500).json({ message: "Server error", orders: [] });
  }
};

// =====================================
// GET SELLER ORDERS
// =====================================
const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.seller?.id || req.seller?._id;
    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Seller authentication failed",
        orders: [],
      });
    }

    const orders = await Order.find({ sellerId })
      .populate("customerId", "name phone")
      .populate("productId", "productName images price")
      .populate("deliveryBoyId", "name phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Seller orders fetched successfully",
      orders: orders || [],
    });
  } catch (error) {
    console.error("Get Seller Orders Error:", error);
    res.status(500).json({ success: false, message: "Server error", orders: [] });
  }
};

// =====================================
// CANCEL ORDER (30 MINS WINDOW & PRE-ASSIGNMENT LOCK)
// =====================================
const cancelCustomerOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const customerId = req.user?.id || req.user?._id;

    const order = await Order.findOne({ _id: orderId, customerId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.status === "cancelled" || order.status === "delivered") {
      return res.status(400).json({ success: false, message: "This order cannot be cancelled" });
    }

    // ১. ডেলিভারি বয় এক্সেপ্ট করে ফেললে ক্যান্সেল বন্ধ
    if (order.deliveryBoyId || ["assigned", "picked_up", "out_for_delivery"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "A delivery partner has already accepted this order. Cancellation is no longer allowed.",
      });
    }

    // ২. ৩০ মিনিটের মেয়াদ যাচাই
    const orderCreatedAt = new Date(order.createdAt).getTime();
    const diffMinutes = (Date.now() - orderCreatedAt) / (1000 * 60);

    if (diffMinutes > 30) {
      return res.status(400).json({
        success: false,
        message: "Cancellation window expired! Orders can only be cancelled within 30 minutes.",
      });
    }

    order.status = "cancelled";
    await order.save();

    // স্টক রিভার্স করা
    await SellerProduct.findByIdAndUpdate(order.productId, {
      $inc: { stock: order.quantity },
    });

    // সকেট নোটিফিকেশন
    const io = getIO();
    if (io) {
      const cancelPayload = {
        orderId: String(order._id),
        message: "Order has been cancelled by customer",
      };

      io.to(`seller_${order.sellerId}`).emit("orderCancelledAlert", cancelPayload);
      io.emit("orderTaken", { orderId: order._id });
      io.emit("orderCancelled", cancelPayload);
    }

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel Order Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =====================================
// SELLER ACCEPT ORDER
// =====================================
const sellerAcceptOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const sellerId = req.seller?.id || req.seller?._id;

    const order = await Order.findOne({ _id: orderId, sellerId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.paymentMethod === "ONLINE" && order.paymentStatus !== "paid") {
      return res.status(400).json({ message: "Online payment is not completed yet" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ message: "This order cannot be accepted" });
    }

    order.status = "ready_for_shipping";
    await order.save();

    const io = getIO();

    if (io && order.customerId) {
      const customerIdStr = String(order.customerId);
      const customerUpdatePayload = {
        orderId: order._id,
        status: "ready_for_shipping",
        message: "Your order has been accepted and is being packed!",
      };

      io.to(`customer_${customerIdStr}`).emit("orderStatusUpdated", customerUpdatePayload);
      io.emit("globalOrderStatusUpdated", { customerId: customerIdStr, ...customerUpdatePayload });
    }

    const deliveryBoys = await DeliveryBoy.find({
      isOnline: true,
      isAvailable: true,
    }).select("_id name phone location");

    const deliveryPayload = {
      orderId: String(order._id),
      _id: String(order._id),
      message: "New delivery order available!",
      customerId: order.customerId,
      productName: order.productName,
      quantity: order.quantity,
      productTotal: order.productTotal,
      deliveryCharge: order.deliveryCharge,
      deliveryBoyEarning: order.deliveryBoyEarning,
      totalAmount: order.totalAmount,
      distanceKm: order.distanceKm,
      shippingAddress: order.shippingAddress,
      customerLocation: order.customerLocation,
      sellerLocation: order.sellerLocation,
    };

    if (io) {
      for (const boy of deliveryBoys) {
        const boyRoom = `deliveryBoy_${String(boy._id)}`;
        io.to(boyRoom).emit("newDeliveryOrder", deliveryPayload);
        io.to(boyRoom).emit("orderAssigned", deliveryPayload);
      }
      io.emit("newDeliveryOrder", deliveryPayload);
      io.emit("orderAssigned", deliveryPayload);
    }

    res.status(200).json({
      success: true,
      message: "Order accepted, customer and delivery partners notified",
      order,
      notifiedDeliveryBoys: deliveryBoys.length,
    });
  } catch (error) {
    console.error("Seller Accept Order Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =====================================
// DELIVERY BOY ACCEPT ORDER
// =====================================
const deliveryBoyAcceptOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const deliveryBoyId = req.deliveryBoy?.id || req.deliveryBoy?._id;

    const order = await Order.findOneAndUpdate(
      {
        _id: orderId,
        status: "ready_for_shipping",
        deliveryBoyId: null,
      },
      {
        $set: {
          deliveryBoyId: deliveryBoyId,
          status: "assigned",
          deliveryAcceptedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!order) {
      return res.status(400).json({
        message: "This order has already been assigned or is no longer available",
      });
    }

    await DeliveryBoy.findByIdAndUpdate(deliveryBoyId, { $set: { isAvailable: false } });

    const io = getIO();
    if (io) {
      io.to(`customer_${order.customerId}`).emit("deliveryBoyAssigned", {
        orderId: order._id,
        message: "Delivery partner has accepted your order",
        deliveryBoyId: deliveryBoyId,
      });

      io.to(`seller_${order.sellerId}`).emit("deliveryBoyAssigned", {
        orderId: order._id,
        message: "A delivery partner has accepted the pickup",
        deliveryBoyId: deliveryBoyId,
      });

      io.emit("orderTaken", { orderId: order._id });
    }

    res.status(200).json({
      success: true,
      message: "Delivery order accepted successfully",
      order,
    });
  } catch (error) {
    console.error("Delivery Boy Accept Order Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =====================================
// GET ORDER DETAILS
// =====================================
const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("sellerId", "name phone storeAddress location")
      .populate("productId", "productName images price")
      .populate("deliveryBoyId", "name phone location");

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json({
      success: true,
      message: "Order details fetched successfully",
      order,
    });
  } catch (error) {
    console.error("Get Order Details Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getSellerOrders,
  cancelCustomerOrder,
  sellerAcceptOrder,
  deliveryBoyAcceptOrder,
  getOrderDetails,
};