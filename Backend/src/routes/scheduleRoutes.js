const express = require("express");
const {
  getSchedulesByDate,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  countSchedulesByMonth,
  exportSchedulesByDate,
  exportSchedulesByMonth,
} = require("../controllers/scheduleController");
const router = express.Router();

// Route lấy lịch trình theo ngày
router.get("/getbydate/:year/:month/:day", getSchedulesByDate);

router.route("/").post(createSchedule);
router.route("/:id").put(updateSchedule).delete(deleteSchedule);

router.route("/count/month/:year/:month").get(countSchedulesByMonth);

router.get("/exportbydate/:year/:month/:day", exportSchedulesByDate);

router.get("/exportbymonth/:year/:month", exportSchedulesByMonth);

module.exports = router;
