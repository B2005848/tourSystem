// models/ships.js
const mongoose = require("mongoose");

const shipsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    set: (v) => v.toUpperCase(),
  },
  nation: { type: String },
  length: { type: Number },
  draft: { type: Number },
  gt: { type: Number },
  visitting: { type: String },
});

module.exports = mongoose.model("Ships", shipsSchema);
