// models/scheduleModel.js
const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  idUser: { type: String, required: true },
  idShip: { type: String, required: true },
  date: { type: Date, required: true },
  to: { type: String, required: true },
  from: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, required: true },
  comments: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Schedule", scheduleSchema);
