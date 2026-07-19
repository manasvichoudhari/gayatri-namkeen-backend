const Cart = require("../models/Cart");

// ADD
const addToCart = async (req, res) => {
  try {
    const { userId, productName, price, image } = req.body;

    const existingItem = await Cart.findOne({ userId, productName });

    if (existingItem) {
      existingItem.quantity += 1;
      await existingItem.save();

      return res.status(200).json(existingItem);
    }

    const cartItem = await Cart.create({
      userId,
      productName,
      price,
      image,
      quantity: 1,
    });

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET
const getCartItems = async (req, res) => {
  try {
    const items = await Cart.find({ userId: req.params.userId });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REMOVE
const removeCartItem = async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// INCREASE
const increaseQuantity = async (req, res) => {
  try {
    const item = await Cart.findById(req.params.id);

    if (!item) return res.status(404).json({ message: "Not found" });

    item.quantity += 1;
    await item.save();

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DECREASE
const decreaseQuantity = async (req, res) => {
  try {
    const item = await Cart.findById(req.params.id);

    if (!item) return res.status(404).json({ message: "Not found" });

    if (item.quantity > 1) {
      item.quantity -= 1;
      await item.save();
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// CLEAR WHOLE CART
const clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.params.userId });

    res.json({
      success: true,
      message: "Cart Cleared Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
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