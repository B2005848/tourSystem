// models/scheduleModel.js
const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  idUser: { type: String, required: true },
  idShip: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Ships",
  },
  date: { type: Date, required: true },
  to: { type: String, required: true },
  from: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: Number, required: true },
  comments: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
// Thêm index để đảm bảo `idUser`, `date`, và `time` là duy nhất
scheduleSchema.index({ idUser: 1, date: 1, time: 1 }, { unique: true });
module.exports = mongoose.model("Schedule", scheduleSchema);
