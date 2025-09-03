const paymentModel = require("../models/payment.model");
const productModel = require("../models/product.model");
const razorpay = require("../services/razorpay.sevices");

async function createOrder(req, res) {
  const productId = req.params.product;
  const product = await productModel.findById(productId);
  const options = {
    amount: product.price.amount, // amount in smallest currency unit
    currency: product.price.currency,
  };
  try {
    const order = await razorpay.orders.create(options);
    const newPayment = await paymentModel.create({
      orderId: order.id,
      product: productId,
      user: req.user,
      price: {
        amount: order.amount,
        currency: order.currency,
      },
      status: "pending",
    });

    res.status(201).json({
      message: "Order Created Successfully",
      newPayment,
      productId,
    });
  } catch (error) {
    res.status(500).send("Error creating order");
  }
}

async function verifyOrder(req, res) {
  const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
  const secret = process.env.RAZORPAY_SECRET_KEY;
  try {
    const {
      validatePaymentVerification,
    } = require("../../node_modules/razorpay/dist/utils/razorpay-utils.js");

    const result = validatePaymentVerification(
      { order_id: razorpayOrderId, payment_id: razorpayPaymentId },
      signature,
      secret
    );
    if (result) {
      const payment = await paymentModel.findOne({ orderId: razorpayOrderId });
      payment.paymentId = razorpayPaymentId;
      payment.signature = signature;
      payment.status = "completed";
      await payment.save();
      res.json({ status: "success" });
    } else {
      res.status(400).send("Invalid signature");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error verifying payment");
  }
}

module.exports = { createOrder, verifyOrder };
