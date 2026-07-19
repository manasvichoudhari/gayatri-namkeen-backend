const Order = require("../models/Order");
const { sendOrderStatusEmail } = require("../services/emailService");

// =======================
// GET ALL ORDERS (ADMIN)
// =======================
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.log("Get Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// UPDATE ORDER STATUS
// ==========================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = orderStatus;
    await order.save();

    try {
      await sendOrderStatusEmail(order);
    } catch (err) {
      console.log("Status Email Error:", err.message);
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.log("Update Order Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};