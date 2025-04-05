const OnLeaveModel = require("../models/onLeaveModel");

// GET all leave records
const getOnLeave = async (req, res) => {
  try {
    const { month, year } = req.query;

    let filter = {};

    if (month && year) {
      const start = new Date(year, month - 1, 1); // ngày đầu tháng
      const end = new Date(year, month, 0, 23, 59, 59, 999); // ngày cuối tháng

      filter = {
        startDate: {
          $gte: start,
          $lte: end,
        },
      };
    }

    const leaves = await OnLeaveModel.find(filter);
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch leave records.",
      error: error.message,
    });
  }
};

// POST a new leave record
const createOnLeave = async (req, res) => {
  try {
    const { username, startDate, endDate, reason } = req.body;

    if (!username || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return res
        .status(400)
        .json({ message: "End date must be after start date." });
    }

    // Tính ngày đầu và cuối của tháng
    const monthStart = new Date(start.getFullYear(), start.getMonth(), 1);
    const monthEnd = new Date(
      start.getFullYear(),
      start.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    // Kiểm tra xem đã có lịch nghỉ trong tháng chưa
    const existingLeave = await OnLeaveModel.findOne({
      username,
      startDate: { $gte: monthStart, $lte: monthEnd },
    });

    if (existingLeave) {
      return res.status(409).json({
        message: "This employee already has a leave scheduled in this month.",
      });
    }

    const newLeave = new OnLeaveModel({ username, startDate, endDate, reason });
    const savedLeave = await newLeave.save();

    res
      .status(201)
      .json({ message: "Leave created successfully.", leave: savedLeave });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create leave.", error: error.message });
  }
};

// PUT update leave by ID
const updateOnLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, startDate, endDate, reason } = req.body;

    const updatedLeave = await OnLeaveModel.findByIdAndUpdate(
      id,
      { username, startDate, endDate, reason },
      { new: true, runValidators: true }
    );

    if (!updatedLeave) {
      return res.status(404).json({ message: "Leave not found." });
    }

    res
      .status(200)
      .json({ message: "Leave updated successfully.", leave: updatedLeave });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update leave.", error: error.message });
  }
};

// DELETE leave by ID
const deleteOnLeave = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLeave = await OnLeaveModel.findByIdAndDelete(id);

    if (!deletedLeave) {
      return res.status(404).json({ message: "Leave not found." });
    }

    res.status(200).json({ message: "Leave deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete leave.", error: error.message });
  }
};

module.exports = {
  getOnLeave,
  createOnLeave,
  updateOnLeave,
  deleteOnLeave,
};
