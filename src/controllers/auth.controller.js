const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function createUser({
  username,
  email,
  fullName: { firstName, lastName },
  password,
  role = "user",
}) {
  const existingUser = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new Error("User already exist");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    username,
    email,
    fullName: { firstName, lastName },
    password: hashPassword,
    role,
  });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  return { user, token };
}

async function registerUser(req, res) {
  const {
    username,
    email,
    fullName: { firstName, lastName },
    password,
  } = req.body;

  try {
    const { user, token } = await createUser({
      username,
      email,
      fullName: { firstName, lastName },
      password,
    });
    res.cookie("token", token);
    res.status(201).json({
      message: "User Registered Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "User already exist",
    });
  }
}

async function loginuser(req, res) {
  try {
    const { username, email, password } = req.body;
    const user = await userModel
      .findOne({
        $or: [{ username }, { email }],
      })
      .select("+password");
    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(422).json({
        message: "Incorrect Password",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token);

    res.status(200).json({
      message: "User LoggedIn Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
  }
}

async function registerSeller(req, res) {
  const {
    username,
    email,
    fullName: { firstName, lastName },
    password,
  } = req.body;

  try {
    const { user, token } = await createUser({
      username,
      email,
      fullName: { firstName, lastName },
      password,
      role: "seller",
    });
    res.cookie("token", token);
    res.status(201).json({
      message: "Seller Registered Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "Seller already exist",
    });
  }
}

module.exports = { registerUser, registerSeller, loginuser };
