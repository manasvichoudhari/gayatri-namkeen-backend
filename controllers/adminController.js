console.log("Admin Controller Loaded");
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { sendOrderStatusEmail } = require("../services/emailService");

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Email from frontend:", email);
    console.log("Password from frontend:", password);

    console.log("ENV Email:", process.env.ADMIN_EMAIL);
    console.log("ENV Password:", process.env.ADMIN_PASSWORD);

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        role: "admin",
        email: process.env.ADMIN_EMAIL,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
    });
  } catch (error) {
    console.error("Admin Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log("Get Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(orderId);

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
      order,
    });
  } catch (error) {
    console.log("Update Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};
const getDashboard = async (req, res) => {
  try {
    // Total Products
    const totalProducts = await Product.countDocuments();

    // Total Orders
    const totalOrders = await Order.countDocuments();

    // Total Revenue
    const revenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue = revenue.length ? revenue[0].total : 0;

    // Monthly Revenue
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    const monthly = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    const monthlyRevenue = monthly.length ? monthly[0].total : 0;

    // Pending Orders
    const pendingOrders = await Order.countDocuments({
      orderStatus: { $ne: "DELIVERED" },
    });

    // Delivered Orders
    const deliveredOrders = await Order.countDocuments({
      orderStatus: "DELIVERED",
    });

    return res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalRevenue,
        monthlyRevenue,
        pendingOrders,
        deliveredOrders,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Dashboard Error",
    });
  }
};
const User = require("../models/User");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log("Get Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};
const getTopProducts = async (req, res) => {
  try {
    const orders = await Order.find();

    const productMap = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (productMap[item.productName]) {
          productMap[item.productName] += item.quantity;
        } else {
          productMap[item.productName] = item.quantity;
        }
      });
    });
    const topProducts = Object.keys(productMap)
      .map((name) => ({
        name,
        totalSold: productMap[name],
      }))
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);

    return res.status(200).json({
      success: true,
      topProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Top products error",
    });
  }
};

module.exports = {
  adminLogin,
  getAllOrders,
  updateOrderStatus,
  getDashboard,
  getAllUsers,
  getTopProducts,
};
