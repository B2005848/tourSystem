// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    set: (v) => v.toUpperCase(),
  },
  name: { type: String, required: true, set: (v) => v.toUpperCase() },
  birthday: { type: String },
  phone: { type: String },
  visitting: { type: String },
  status: { type: Number, default: 1 },
});

module.exports = mongoose.model("Users", userSchema);
