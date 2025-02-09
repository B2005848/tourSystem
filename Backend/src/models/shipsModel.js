// models/User.js
const mongoose = require("mongoose");

const shipsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    set: (v) => v.toUpperCase(),
  },
  visitting: { type: String },
});

module.exports = mongoose.model("Ships", shipsSchema);
