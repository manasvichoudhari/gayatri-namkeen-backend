const express = require("express");
const router = express.Router();

const {
  createOffer,
  getAllOffers,
  getActiveOffers,
  deleteOffer,
} = require("../controllers/offerController");

const adminAuth = require("../middleware/adminAuth");

router.post("/", adminAuth, createOffer);

router.get("/", getAllOffers);

router.get("/active", getActiveOffers);

router.delete("/:id", adminAuth, deleteOffer);

module.exports = router;