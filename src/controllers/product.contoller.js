const productModel = require("../models/product.model");
const uploadImage = require("../services/storage.services");

async function createProduct(req, res) {
  try {
    const price = req.body.price ? JSON.parse(req.body.price) : null;
    const seller = req.seller;

    const { title, description, stock } = req.body;

    const files = await Promise.all(
      req.files.map(async (file) => {
        return await uploadImage(file.buffer);
      })
    );

    const product = await productModel.create({
      title,
      description,
      images: files.map((i) => i.url),
      price: { amount: price?.amount, currency: price?.currency || "INR" },
      seller: seller._id,
      stoke: parseInt(stock) || 0,
    });

    res.status(201).json({
      message: "Product Created Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
  }
}

async function getProducts(req, res) {
  try {
    const seller = req.seller;

    const allProducts = await productModel.find({ seller: seller._id });

    res.status(200).json({
      message: "All Products",
      allProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}


module.exports = { createProduct, getProducts };
