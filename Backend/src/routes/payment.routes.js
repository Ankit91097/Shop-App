const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post(
  "/create/:product",
  authMiddleware.authUser,
  paymentController.createOrder
);

router.post("/verify", authMiddleware.authUser, paymentController.verifyOrder);

module.exports = router;
