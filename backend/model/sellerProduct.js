

// const mongoose = require("mongoose");

// const sellerProductSchema = new mongoose.Schema(
//   {
//     sellerId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Seller",
//       required: true,
//     },
//     productName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     description: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     category: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     price: {
//       type: Number,
//       required: true,
//       min: 0,
//     },
//     discountPrice: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },
//     stock: {
//       type: Number,
//       required: true,
//       default: 0,
//       min: 0,
//     },
//     images: {
//       type: [String],
//       default: [],
//     },
//     unit: {
//       type: String,
//       default: "piece",
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//     // ⭐ রেটিং ও রিভিউ সংক্রান্ত নতুন ফিল্ড
//     averageRating: {
//       type: Number,
//       default: 0,
//       min: 0,
//       max: 5,
//     },
//     totalReviews: {
//       type: Number,
//       default: 0,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const SellerProduct = mongoose.model("SellerProduct", sellerProductSchema);
// module.exports = SellerProduct;





















const mongoose = require("mongoose");

const sellerProductSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    unit: {
      type: String,
      default: "piece",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // 👁️ ক্লিক এবং ভিউ কাউন্ট সেভ রাখার ফিল্ড
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const SellerProduct = mongoose.model("SellerProduct", sellerProductSchema);
module.exports = SellerProduct;