const express = require("express");
const router = express.Router();

const {
  createOffer,
  getAllOffers,
  deleteOffer,
} = require("../controllers/offerController");

const adminAuth = require("../middleware/adminAuth");

// CREATE
router.post("/", adminAuth, createOffer);

// GET ALL
router.get("/",  getAllOffers);



// DELETE
router.delete("/:id", adminAuth, deleteOffer);

module.exports = router;