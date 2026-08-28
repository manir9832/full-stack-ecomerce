// const mongoose = require("mongoose");

// const deliveryBoySchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     phone: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     password: {
//       type: String,
//       required: true,
//     },

//     aadhaarNumber: {
//       type: String,
//       required: true,
//     },

//     role: {
//       type: String,
//       default: "deliveryBoy",
//     }, // Admin approval

//     isApproved: {
//       type: Boolean,
//       default: false,
//     }, // Delivery boy online/offline

//     isOnline: {
//       type: Boolean,
//       default: false,
//     }, // Can receive a new order?

//     isAvailable: {
//       type: Boolean,
//       default: true,
//     }, // Current live location

//     location: {
//       latitude: {
//         type: Number,
//         default: null,
//       },

//       longitude: {
//         type: Number,
//         default: null,
//       },
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// const DeliveryBoy = mongoose.model("DeliveryBoy", deliveryBoySchema);

// module.exports = DeliveryBoy;

















const mongoose = require("mongoose");

const deliveryBoySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
    // 👉 অবজেক্ট হিসেবে এনক্রিপশন ডেটা রাখার ব্যবস্থা
    aadhaarNumber: {
      encryptedData: { type: String, required: true },
      iv: { type: String, required: true },
      authTag: { type: String, required: true },
    },
    role: {
      type: String,
      default: "deliveryBoy",
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
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
    timestamps: true,
  }
);

module.exports = mongoose.models.DeliveryBoy || mongoose.model("DeliveryBoy", deliveryBoySchema);