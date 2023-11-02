const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
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
    },
    password: {
      type: String,
    },
    roles: [
      {
        type: String,
        enum: ["admin", "employee"],
        default: "employee",
      },
    ],
    designation: {
      type: String,
    },
    avatar: {
      type: String,
    },
    status: {
      type: String,
      enum: ["activated", "deactivated"],
      default: "activated",
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
    dateDeactivated: {
      type: Date,
    },
    department: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    phone: {
      type: String,
    },
    cnic: {
      type: String,
      validate: {
        validator: function (v) {
          return /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/.test(v);
        },
        message: "Invalid CNIC format. Correct format: 12345-1234567-1",
      },
    },
    address: {
      type: String,
    },
    resetToken: {
      type: String,
    },
    resetTokenExpiration: {
      type: Date,
    },
    newPassword: {
      type: String,
    },
    checkInOut: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Checks",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", userSchema);
