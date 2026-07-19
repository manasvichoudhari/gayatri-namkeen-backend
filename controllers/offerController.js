const Offer = require("../models/Offers");

// CREATE
const createOffer = async (req, res) => {
  const offer = await Offer.create(req.body);
  res.json({ success: true, offer });
};

// GET ALL
const getAllOffers = async (req, res) => {
  const offers = await Offer.find().sort({ createdAt: -1 });
  res.json({ success: true, offers });
};



// DELETE
const deleteOffer = async (req, res) => {
  await Offer.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};

module.exports = {
  createOffer,
  getAllOffers,
  deleteOffer,
};