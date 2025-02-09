const express = require("express");
const {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  countSchedulesByMonth,
} = require("../controllers/scheduleController");
const router = express.Router();

router.route("/").get(getSchedules).post(createSchedule);
router.route("/:id").put(updateSchedule).delete(deleteSchedule);

router.route("/count/month/:year/:month").get(countSchedulesByMonth);
module.exports = router;
