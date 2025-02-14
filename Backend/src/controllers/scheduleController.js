const Schedule = require("../models/scheduleModel");
const ExcelJS = require("exceljs");
const formatDate = require("../helper/format-datetime");
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
      .populate("idShip", "name") // Lấy tên tàu
      .populate("idUser", "name id"); // Lấy tên người dùng

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

// Export to Excel file by date
const exportSchedulesByDate = async (req, res) => {
  try {
    const { year, month, day } = req.params;

    if (!year || !month || !day) {
      return res
        .status(400)
        .json({ message: "Year, month, and day are required" });
    }

    const date = new Date(year, month - 1, day);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    // Lấy danh sách lịch trình
    const schedules = await Schedule.find({
      date: { $gte: startOfDay, $lt: endOfDay },
    })
      .populate("idUser", "name")
      .populate("idShip", "name");

    if (!schedules.length) {
      return res
        .status(404)
        .json({ message: "No schedules found for this date" });
    }

    // Tạo workbook Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("LichTrinh");

    // Tạo tiêu đề cột
    worksheet.columns = [
      { header: "STT", key: "index", width: 5 },
      { header: "Mã Hoa Tiêu", key: "userId", width: 15 },
      { header: "Tên Hoa Tiêu", key: "userName", width: 20 },
      { header: "Tàu", key: "shipName", width: 15 },
      { header: "Ngày", key: "date", width: 15 },
      { header: "Giờ", key: "time", width: 10 },
      { header: "Điểm Đi", key: "from", width: 15 },
      { header: "Điểm Đến", key: "to", width: 15 },
      { header: "Ghi Chú", key: "comments", width: 10 },
      { header: "Trạng Thái", key: "status", width: 10 },
    ];
    worksheet.getRow(1).font = { bold: true };
    // Thêm dữ liệu vào file Excel
    schedules.forEach((schedule, index) => {
      worksheet.addRow({
        index: index + 1,
        userName: schedule.idUser ? schedule.idUser.name : "Không xác định",
        shipName: schedule.idShip ? schedule.idShip.name : "Không xác định",
        date: new Date(schedule.date).toLocaleDateString("vi-VN"),
        time: schedule.time,
        from: schedule.from,
        to: schedule.to,
        comments: schedule.comments,
        status: schedule.status === 1 ? "CHUẨN BỊ" : "HOÀN THÀNH",
      });
    });

    // Xuất file Excel
    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader("Content-Disposition", "attachment; filename=XEPTUA.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const exportSchedulesByMonth = async (req, res) => {
  try {
    const { year, month } = req.params; // Lấy năm và tháng từ URL

    if (!year || !month) {
      return res.status(400).json({ message: "Year and month are required" });
    }

    // Tính ngày bắt đầu và kết thúc của tháng
    const startOfMonth = new Date(year, month - 1, 1); // Tháng - 1 vì JavaScript tháng bắt đầu từ 0
    const endOfMonth = new Date(year, month, 0); // Ngày cuối cùng của tháng

    // Lấy lịch trình trong tháng
    const schedules = await Schedule.find({
      date: { $gte: startOfMonth, $lt: endOfMonth },
    })
      .populate("idUser", "name") // Lấy tên người dùng
      .populate("idShip", "name"); // Lấy tên tàu

    if (schedules.length === 0) {
      return res
        .status(404)
        .json({ message: "No schedules found for this month" });
    }

    // Tạo workbook và worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Lịch Trình");

    // Đặt tên cột
    worksheet.columns = [
      { header: "STT", key: "index", width: 5 },
      { header: "Mã Hoa Tiêu", key: "userId", width: 15 },
      { header: "Tên Hoa Tiêu", key: "userName", width: 20 },
      { header: "Tàu", key: "shipName", width: 15 },
      { header: "Ngày", key: "date", width: 15 },
      { header: "Giờ", key: "time", width: 10 },
      { header: "Điểm Đi", key: "from", width: 15 },
      { header: "Điểm Đến", key: "to", width: 15 },
      { header: "Ghi Chú", key: "comments", width: 10 },
      { header: "Trạng Thái", key: "status", width: 10 },
    ];
    worksheet.getRow(1).font = { bold: true };

    // Thêm dữ liệu vào worksheet
    schedules.forEach((schedule, index) => {
      worksheet.addRow({
        index: index + 1,
        userId: schedule.idUser.id,
        userName: schedule.idUser ? schedule.idUser.name : "Không xác định",
        shipName: schedule.idShip ? schedule.idShip.name : "Không xác định",
        date: schedule.date.toISOString().split("T")[0], // Định dạng ngày
        time: schedule.time,
        from: schedule.from,
        to: schedule.to,
        comments: schedule.comments || "",
        status: schedule.status === 1 ? "CHUẨN BỊ" : "HOÀN THÀNH",
      });
    });

    // Xuất file Excel
    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader("Content-Disposition", "attachment; filename=TUATHANG.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
module.exports = {
  getSchedulesByDate,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  countSchedulesByMonth,
  exportSchedulesByDate,
  exportSchedulesByMonth,
};
