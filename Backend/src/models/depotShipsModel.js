const mongoose = require("mongoose");

const depotShipsSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    set: (v) => v.toUpperCase(),
  },
  name: {
    type: String,
    required: true,
    unique: true,
    set: (v) => v.toUpperCase(),
  },
});

module.exports = mongoose.model("DepotShips", depotShipsSchema);
