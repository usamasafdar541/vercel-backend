const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      // required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(v);
        },
        message: "Invalid email address",
      },
    },
    name: {
      type: String,
      // required: [true, "Username is required"],
    },
    password: {
      type: String,
      // required: [true, "Password is Required"],
    },
    designation: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Users", userSchema);
