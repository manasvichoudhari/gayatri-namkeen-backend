const express = require("express");
const router = express.Router();

const { 
adminLogin,
getAllOrders,
updateOrderStatus,
getDashboard,
getAllUsers,
getTopProducts,
} = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth");

router.post("/login", adminLogin);
router.get("/orders", adminAuth, getAllOrders);
router.put("/orders/:orderId", adminAuth, updateOrderStatus);
router.get("/dashboard", adminAuth, getDashboard);
router.get("/users", adminAuth, getAllUsers);
router.get("/top-products", adminAuth, getTopProducts);

module.exports = router;