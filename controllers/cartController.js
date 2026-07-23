const Cart = require("../models/Cart");
const mongoose = require("mongoose");

// ================= ADD TO CART =================

const addToCart = async (req, res) => {
  try {
    const { productName, price, image, quantity, weight } = req.body;

    const userId = req.user._id;

    if (!productName || !price) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const existingItem = await Cart.findOne({
      userId,
      productName,
      weight,
    });

    if (existingItem) {
      existingItem.quantity += quantity || 1;

      await existingItem.save();

      return res.status(200).json({
        success: true,
        message: "Cart updated successfully",
        cartItem: existingItem,
      });
    }

    const cartItem = await Cart.create({
      userId,
      productName,
      price,
      image,
      quantity: quantity || 1,
      weight,
    });

    res.status(201).json({
      success: true,
      message: "Item added to cart",
      cartItem,
    });
  } catch (error) {
    console.log("ADD CART ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET CART =================

const getCartItems = async (req, res) => {
  console.log("===== GET CART HIT =====");
  try {
    console.log("INSIDE GET CART");
    console.log("req.user =", req.user);
    const items = await Cart.find({
      userId: req.user._id,
    });
    console.log("Items =", items);
    res.status(200).json({
      success: true,
      items,
    });
  } catch (error) {
    console.log("GET CART ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= REMOVE ITEM =================

const removeCartItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart id",
      });
    }

    const item = await Cart.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    await Cart.deleteOne({
      _id: id,
      userId: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Item removed successfully",
    });
  } catch (error) {
    console.log("REMOVE CART ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= INCREASE =================

const increaseQuantity = async (req, res) => {
  try {
    const item = await Cart.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    item.quantity += 1;

    await item.save();

    res.status(200).json({
      success: true,
      message: "Quantity increased",
      item,
    });
  } catch (error) {
    console.log("INCREASE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DECREASE =================

const decreaseQuantity = async (req, res) => {
  try {
    const item = await Cart.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    if (item.quantity > 1) {
      item.quantity -= 1;
      await item.save();
    }

    res.status(200).json({
      success: true,
      message: "Quantity decreased",
      item,
    });
  } catch (error) {
    console.log("DECREASE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= CLEAR CART =================

const clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({
      userId: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.log("CLEAR CART ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addToCart,
  getCartItems,
  removeCartItem,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
};
