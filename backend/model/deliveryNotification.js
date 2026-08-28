const mongoose = require("mongoose");

const deliveryBoyNotificationSchema = new mongoose.Schema(
  {
    deliveryBoyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryBoy",
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Notification = mongoose.model(
  "DeliveryBoyNotification",
  deliveryBoyNotificationSchema,
);

module.exports = Notification;
