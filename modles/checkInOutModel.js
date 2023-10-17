const mongoose = require("mongoose");

const checkInOutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  checkInTime: {
    type: Date,
    default: null,
  },

  checkOutTime: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("Checks", checkInOutSchema);
