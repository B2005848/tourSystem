const mongoose = require("mongoose");

const onLeave = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  reason: {
    type: String,
  },
});

module.exports = mongoose.model("Onleave", onLeave);
