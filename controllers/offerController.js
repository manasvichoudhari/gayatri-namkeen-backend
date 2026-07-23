const Offer = require("../models/Offers");

// CREATE
const createOffer = async (req, res) => {
  try {
    const offer = await Offer.create(req.body);

    res.json({
      success: true,
      offer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL
const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      offers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ACTIVE
const getActiveOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      offers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE
const deleteOffer = async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Offer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOffer,
  getAllOffers,
  getActiveOffers,
  deleteOffer,
};