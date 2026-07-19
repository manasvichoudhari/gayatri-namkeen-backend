const express = require("express");
const router = express.Router();

const adminAuth = require("../middleware/adminAuth");

const {
  getAllUsers,
  toggleBlockUser,
  deleteUser,
} = require("../controllers/adminUserController");

router.get("/", adminAuth, getAllUsers);
router.put("/:id/block", adminAuth, toggleBlockUser);
router.delete("/:id", adminAuth, deleteUser);

module.exports = router;