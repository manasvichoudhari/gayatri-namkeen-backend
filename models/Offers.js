const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Offer", offerSchema);