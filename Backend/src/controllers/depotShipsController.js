const DepotShips = require("../models/depotShipsModel");

// Get all depot ships
const getDepotShips = async (req, res) => {
  try {
    const depotShips = await DepotShips.find();
    res.json({ depotShips });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new depot ship
const createDepotShip = async (req, res) => {
  try {
    const { id, name = "" } = req.body;

    // Check if depot ship with the same ID or name already exists
    const existingDepotShip = await DepotShips.findOne({
      $or: [{ id }, { name }],
    });
    if (existingDepotShip) {
      return res
        .status(400)
        .json({ message: "Depot ship with this ID or name already exists" });
    }

    const depotShip = new DepotShips({ id, name });
    await depotShip.save();
    res.status(201).json(depotShip);
    console.log(`Depot ship ${name} created successfully`);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update depot ship information
const updateDepotShip = async (req, res) => {
  try {
    const { id } = req.params; // ID from URL
    const { name } = req.body;

    const depotShip = await DepotShips.findOne({ id });
    if (!depotShip) {
      return res.status(404).json({ message: "Depot ship not found" });
    }

    // Update data
    depotShip.name = name !== undefined ? name.toUpperCase() : depotShip.name;

    // Save changes
    await depotShip.save();
    res.json(depotShip);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a depot ship
const deleteDepotShip = async (req, res) => {
  try {
    const { id } = req.params; // ID from URL

    const depotShip = await DepotShips.findOne({ id });
    if (!depotShip) {
      return res.status(404).json({ message: "Depot ship not found" });
    }

    // Delete depot ship
    await DepotShips.deleteOne({ id });
    res.json({ message: "Depot ship deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getDepotShips,
  createDepotShip,
  updateDepotShip,
  deleteDepotShip,
};
