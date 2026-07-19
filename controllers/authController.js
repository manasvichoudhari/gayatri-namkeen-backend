const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");
const transporter = require("../config/mail");

// ================= REGISTER =================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const userExists = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.trim().toLowerCase(),
      phone,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// ================= LOGIN =================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // BLOCK CHECK
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account is blocked by admin",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate Token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash Token
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save Token
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    // Reset URL
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    try {
      const info = await transporter.sendMail({
        from: process.env.EMAIL,
        to: user.email,
        subject: "Reset Your Password",
        html: `
          <h2>Hello ${user.name},</h2>

          <p>You requested a password reset.</p>

          <p>Click the button below to reset your password.</p>

          <a href="${resetLink}"
          style="
            background:#ff6b00;
            color:#fff;
            padding:12px 22px;
            text-decoration:none;
            border-radius:6px;
            display:inline-block;
            margin:20px 0;
          ">
            Reset Password
          </a>

          <p>This link will expire in <b>15 minutes</b>.</p>

          <p>If you didn't request this, ignore this email.</p>
        `,
      });

      console.log("✅ Email Sent:", info.response);

      return res.status(200).json({
        success: true,
        message: "Password reset link sent successfully.",
      });

    } catch (mailError) {

      // Remove Token if email fails
      user.resetPasswordToken = null;
      user.resetPasswordExpire = null;
      await user.save();

      console.log("Mail Error:", mailError);

      return res.status(500).json({
        success: false,
        message: "Unable to send email.",
      });
    }

  } catch (error) {
    console.log("Forgot Password Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  try {
    console.log("TOKEN RECEIVED:", req.params.token);

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    console.log("HASHED TOKEN:", hashedToken);

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    console.log("FOUND USER:", user);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token invalid or expired",
      });
    }

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};