const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({

  userId: {
    type: String,
    required: true,
  },

  productName: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  image: {
    type: String,
  },

  quantity: {
    type: Number,
    default: 1,
  },
  weight: {
    type: String,
    default: "500g",
  },

});

module.exports = mongoose.model("Cart", cartSchema);