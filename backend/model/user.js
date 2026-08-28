const mongoose = require("mongoose");

const userSchema1 = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "seller", "deliveryBoy", "admin"],
      default: "user",
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    }, // OTP

    otp: {
      type: String,
    },

    otpExpiresAt: {
      type: Date,
    },

    CartItems: {
      type: Object,
      default: {},
    },
    location: {
      latitude: {
        type: Number,
        default: null,
      },
      longitude: {
        type: Number,
        default: null,
      },
    },
  },
  {
    minimize: false,
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema1);

module.exports = User;
