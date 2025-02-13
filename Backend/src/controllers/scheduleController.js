const Schedule = require("../models/scheduleModel");

// Get schedules by date
// Get schedules by date
const getSchedulesByDate = async (req, res) => {
  try {
    const { date } = req.params; // Lấy ngày từ URL

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    // Tìm tất cả lịch trình theo ngày đã cho
    const schedules = await Schedule.find({ date });

    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new schedule
const createSchedule = async (req, res) => {
  try {
    const {
      idUser,
      idShip,
      date,
      to,
      from,
      time,
      status = 1,
      comments,
    } = req.body;
    const existingSchedule = await Schedule.findOne({ idUser, date, time });
    if (existingSchedule) {
      return res.status(400).json({
        message: "Schedule already exists for this user at the specified time",
      });
    }
    const schedule = new Schedule({
      idUser,
      idShip,
      date,
      to,
      from,
      time,
      status,
      comments,
    });
    await schedule.save();
    res.status(201).json(schedule);
    console.log(`Schedule created successfully`);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update schedule information
const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params; // ID from URL
    const { idUser, idShip, date, to, from, time, status, comments } = req.body;

    const schedule = await Schedule.findById(id);
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    // Update data
    schedule.idUser = idUser !== undefined ? idUser : schedule.idUser;
    schedule.idShip = idShip !== undefined ? idShip : schedule.idShip;
    schedule.date = date !== undefined ? date : schedule.date;
    schedule.to = to !== undefined ? to : schedule.to;
    schedule.from = from !== undefined ? from : schedule.from;
    schedule.time = time !== undefined ? time : schedule.time;
    schedule.status = status !== undefined ? status : schedule.status;
    schedule.comments = comments !== undefined ? comments : schedule.comments;
    schedule.updatedAt = Date.now();

    // Save changes
    await schedule.save();
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a schedule
const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params; // ID from URL

    const schedule = await Schedule.findById(id);
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    // Delete schedule
    await Schedule.deleteOne({ _id: id });
    res.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Count total schedules for each user in a specific month
const countSchedulesByMonth = async (req, res) => {
  try {
    const { year, month } = req.params; // Year and month from URL

    const schedules = await Schedule.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(`${year}-${month}-01`),
            $lt: new Date(`${year}-${Number(month) + 1}-01`),
          },
        },
      },
      {
        $group: {
          _id: { idUser: "$idUser" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: 1 } }, //sắp xếp theo thứ tự tăng dần
    ]);

    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getSchedulesByDate,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  countSchedulesByMonth,
};
