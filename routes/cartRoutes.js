const express = require("express");

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
router.post("/add", addToCart);
router.get("/:userId", getCartItems);
router.delete("/remove/:id", removeCartItem);
router.delete("/clear/:userId", clearCart);
router.put("/increase/:id", increaseQuantity);
router.put("/decrease/:id", decreaseQuantity);

module.exports = router;