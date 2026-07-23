const express = require("express");
const router = express.Router();

const {createOrder,getUserOrders,} = require("../controllers/orderController")

const protect = require("../middleware/authMiddleware");


// CREATE ORDER
router.post("/",protect,createOrder);


// USER ORDERS
router.get("/my-orders",protect,getUserOrders);


module.exports = router;