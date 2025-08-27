const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  fullName: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
  },
  password: {
    type: String,
    select: false,
  },
  role: {
    type: String,
    enum: ["seller", "user"],
    default: "user",
  },
});

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
