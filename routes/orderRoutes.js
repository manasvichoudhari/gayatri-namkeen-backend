const express = require("express");
const router = express.Router();

const {
  createOrder,
  getUserOrders,
} = require("../controllers/orderController");

router.post("/", createOrder);

router.get("/my-orders/:userId", getUserOrders);

module.exports = router;