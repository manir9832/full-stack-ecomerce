product.js;
const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: Array,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    OfferPrice: {
      type: Number,
      required: true,
    },
    image: {
      type: Array,
      required: true,
    },
    category: {
      type: Array,
      required: true,
    },
    inStock: {
      type: Object,
      default: {},
    },
    role: {
      type: String,
      enum: ["user", "seller", "admin"],
      default: "user",
    },
    CartItems: {
      type: Object,
      default: {},
    },
  },
  { minimize: false, timestamps: true },
);
module.exports = mongoose.model("Product", productSchema);
