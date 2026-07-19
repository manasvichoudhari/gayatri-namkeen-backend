const Product = require("../models/Product");

// GET ALL
exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

// ADD
exports.addProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.json(product);
};

// UPDATE
exports.updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(product);
};

// DELETE
exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
};