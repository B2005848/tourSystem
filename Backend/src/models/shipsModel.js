// models/ships.js
const mongoose = require("mongoose");

const shipsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    set: (v) => v.toUpperCase(),
  },
  nation: { type: String, set: (v) => v.toUpperCase() },

  length: { type: Number },
  draft: { type: Number },
  gt: { type: Number },
  owner: { type: String, set: (v) => v.toUpperCase() },
  visitting: { type: String, set: (v) => v.toUpperCase() },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Ships", shipsSchema);
