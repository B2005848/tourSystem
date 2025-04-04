const OnLeaveModel = require("../models/onLeaveModel");

const addLeave = async (req, res) => {
  try {
    const { username, startDate, endDate, reason } = req.body;

    if (!username || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newLeave = new OnLeaveModel({
      username,
      startDate,
      endDate,
      reason,
    });

    const savedLeave = await newLeave.save();
    res
      .status(201)
      .json({ message: "Leave added successfully.", leave: savedLeave });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while adding leave." });
  }
};

module.exports = { addLeave };
