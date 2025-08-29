const express = require("express");
const {
  createProduct,
  getProducts,
} = require("../controllers/product.contoller");
const multer = require("multer");
const { authSeller } = require("../middlewares/auth.middleware");
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post("/", authSeller, upload.array("images", 5), createProduct);

router.get("/all", authSeller, getProducts);

module.exports = router;
