const Schedule = require("../models/scheduleModel");

// Get schedules by date with pagination
const getSchedulesByDate = async (req, res) => {
  try {
    const { year, month, day } = req.params; // Lấy năm, tháng, ngày từ URL
    let { page = 1, limit = 10 } = req.query; // Nhận tham số page & limit từ query string

    page = parseInt(page);
    limit = parseInt(limit);

    if (!year || !month || !day) {
      return res
        .status(400)
        .json({ message: "Year, month, and day are required" });
    }

    // Tạo một đối tượng ngày từ các tham số year, month, day
    const date = new Date(year, month - 1, day); // month - 1 vì tháng trong JavaScript bắt đầu từ 0

    if (isNaN(date)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Tính số lượng bỏ qua
    const skip = (page - 1) * limit;

    // Tính ngày bắt đầu và kết thúc
    const startOfDay = new Date(date.setHours(0, 0, 0, 0)); // Lấy thời gian bắt đầu ngày
    const endOfDay = new Date(date.setHours(23, 59, 59, 999)); // Lấy thời gian kết thúc ngày

    // Tìm lịch trình theo ngày với phân trang
    const schedules = await Schedule.find({
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "idShip",
        select: "name",
      });

    // Đếm tổng số lịch trình theo ngày để trả về tổng số trang
    const totalSchedules = await Schedule.countDocuments({
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    res.json({
      page,
      totalPages: Math.ceil(totalSchedules / limit),
      totalSchedules,
      schedules,
    });
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
