const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const authSeller = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(403).json({
      message: "Unauthorized",
    });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findOne({
      _id: decode.id,
    });
    if (user.role !== "seller") {
      return (
        res.status(403),
        json({
          message: "You cannot create product",
        })
      );
    }
    req.seller = user;
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = { authSeller };
