const express = require("express");
const {
  getSchedulesByDate,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  countSchedulesByMonth,
} = require("../controllers/scheduleController");
const router = express.Router();

// Route lấy lịch trình theo ngày
router.get("/getschedules/:date", getSchedulesByDate);

router.route("/").post(createSchedule);
router.route("/:id").put(updateSchedule).delete(deleteSchedule);

router.route("/count/month/:year/:month").get(countSchedulesByMonth);
module.exports = router;
