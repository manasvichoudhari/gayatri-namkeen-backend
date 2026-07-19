const Order = require("../models/Order");

const {
  sendAdminOrderEmail,
  sendCustomerOrderEmail,
} = require("../services/emailService");

exports.createOrder = async (req, res) => {
  try {
    const order = await Order.create({
      userId: req.body.userId,
      items: req.body.items,
      totalAmount: req.body.totalAmount,
      paymentMethod: req.body.paymentMethod,
      paymentStatus: req.body.paymentStatus || "PENDING",
      paymentId: req.body.paymentId || null,
      address: req.body.address,
    });

    //  Response
    res.status(201).json({
      success: true,
      message: "Order Placed Successfully",
      order,
    });

    //  Send emails in background
    sendAdminOrderEmail(order)
      .then(() => console.log("Admin mail sent"))
      .catch((err) => console.log("Admin Mail Error:", err.message));

    sendCustomerOrderEmail(order)
      .then(() => console.log("Customer mail sent"))
      .catch((err) => console.log("Customer Mail Error:", err.message));
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.params.userId,
    }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
