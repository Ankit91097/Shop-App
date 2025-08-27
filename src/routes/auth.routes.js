const express = require("express");
const {
  registerUser,
  registerSeller,
  loginuser,
} = require("../controllers/auth.controller");
const router = express.Router();

router.post("/user/register", registerUser);

router.post("/user/login", loginuser);

router.post("/seller/register", registerSeller);

router.post("/seller/login", loginuser);

module.exports = router;
