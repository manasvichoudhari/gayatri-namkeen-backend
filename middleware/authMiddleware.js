const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    console.log("Authorization Header:", req.headers.authorization);
    const token = authHeader.split(" ")[1];
    console.log("Received Token:", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded:", decoded);
    const user = await User.findById(decoded.id).select("-password");
    console.log("User:", user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    req.user = user;
    console.log("req.user set:", req.user);

    next();
  } catch (error) {
    console.log("Auth Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Not authorized, token invalid",
    });
  }
};

module.exports = protect;
