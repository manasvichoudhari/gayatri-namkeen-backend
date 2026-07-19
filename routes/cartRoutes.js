const express = require("express");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

const {
  addToCart,
  getCartItems,
  removeCartItem,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = require("../controllers/cartController");
router.get("/test", (req, res) => {
  res.json({ message: "Cart route working 👍" });
});
router.post("/add", protect, addToCart);

router.get("/",protect,getCartItems);
router.delete("/:id", protect, removeCartItem);

router.put("/increase/:id", protect, increaseQuantity);

router.put("/decrease/:id", protect, decreaseQuantity);

router.delete("/clear", protect, clearCart);

module.exports = router;