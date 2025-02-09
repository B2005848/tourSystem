const Ships = require("../models/shipsModel");
const mongoose = require("mongoose");
// Lấy danh sách tàu
const getShips = async (req, res) => {
  const ships = await Ships.find();
  res.json(ships);
};

// Tạo tàu mới
const createShip = async (req, res) => {
  const { name, nation, length, draft, gt, visitting } = req.body;

  // Kiểm tra nếu tên tàu đã tồn tại
  const existingShip = await Ships.findOne({ name });
  if (existingShip) {
    return res
      .status(400)
      .json({ message: "Ship with this name already exists" });
  }

  const ship = new Ships({ name, nation, length, draft, gt, visitting });
  await ship.save();
  res.status(201).json(ship);
  console.log(`Ship ${name} created successfully`);
};

// Cập nhật thông tin tàu
const updateShip = async (req, res) => {
  try {
    const { id } = req.params; // ID từ URL
    const { name, nation, length, draft, gt, visitting } = req.body;

    // Kiểm tra nếu ID không hợp lệ
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const ship = await Ships.findById(id);
    if (!ship) {
      return res.status(404).json({ message: "Ship not found" });
    }

    // Cập nhật dữ liệu
    ship.name = name !== undefined ? name.toUpperCase() : ship.name;
    ship.nation = nation !== undefined ? nation : ship.nation;
    ship.length = length !== undefined ? length : ship.length;
    ship.draft = draft !== undefined ? draft : ship.draft;
    ship.gt = gt !== undefined ? gt : ship.gt;
    ship.visitting = visitting !== undefined ? visitting : ship.visitting;

    // Lưu thay đổi
    await ship.save();
    res.json(ship);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Xóa tàu
const deleteShip = async (req, res) => {
  try {
    const { id } = req.params; // ID từ URL

    const ship = await Ships.findById(id);
    if (!ship) {
      return res.status(404).json({ message: "Ship not found" });
    }

    // Xóa ship
    // Xóa ship
    await Ships.deleteOne({ _id: id });
    res.json({ message: "Ship deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Tìm kiếm tàu
const searchShip = async (req, res) => {
  try {
    const { query } = req.query; // Query từ URL
    const ships = await Ships.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { nation: { $regex: query, $options: "i" } },
        { length: isNaN(query) ? undefined : Number(query) },
        { draft: isNaN(query) ? undefined : Number(query) },
        { gt: isNaN(query) ? undefined : Number(query) },
        { visitting: { $regex: query, $options: "i" } },
      ].filter(Boolean),
    });

    if (ships.length === 0) {
      return res.status(404).json({ message: "No ships found" });
    }

    res.json(ships);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
module.exports = { getShips, createShip, updateShip, deleteShip, searchShip };
