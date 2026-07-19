const express = require("express");
const router = express.Router();

const Order = require("../models/Order");

//  SIMPLE ADMIN AUTH MIDDLEWARE
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    //  agar JWT use kar rahe ho to yaha verify karo
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

//  GET ALL ORDERS (ADMIN)
router.get("/", verifyAdmin, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

//  UPDATE ORDER STATUS (ADMIN)
router.put("/:id", verifyAdmin, async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { orderStatus: req.body.orderStatus },
    { new: true }
  );

  res.json(order);
});

module.exports = router;