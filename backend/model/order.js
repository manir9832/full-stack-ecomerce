

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // Customer
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Seller
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },

    // Product
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SellerProduct",
      required: true,
    },

    productName: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // Product total
    productTotal: {
      type: Number,
      required: true,
      min: 0,
    },

    // Delivery charge
    deliveryCharge: {
      type: Number,
      default: 0,
    },

    // Delivery boy earning
    deliveryBoyEarning: {
      type: Number,
      default: 0,
    },

    // Platform charge
    platformCharge: {
      type: Number,
      default: 0,
    },

    // Road distance in KM
    distanceKm: {
      type: Number,
      default: 1,
    },

    // Final amount customer pays
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Delivery Boy
    deliveryBoyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryBoy",
      default: null,
    },

    deliveryAcceptedAt: {
      type: Date,
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

    // Order status
    status: {
      type: String,
      enum: [
        "pending",
        "ready_for_shipping",
        "assigned",
        "picked_up",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    // Customer delivery address (Flexible Schema)
    shippingAddress: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    // Payment
    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    razorpayOrderId: {
      type: String,
      default: null,
    },

    razorpayPaymentId: {
      type: String,
      default: null,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    // Store / Seller location
    sellerLocation: {
      latitude: {
        type: Number,
        default: 22.64,
      },
      longitude: {
        type: Number,
        default: 88.68,
      },
    },

    // Customer location
    customerLocation: {
      latitude: {
        type: Number,
        default: 22.64,
      },
      longitude: {
        type: Number,
        default: 88.68,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;