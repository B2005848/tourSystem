const express = require("express");
const {
  getOnLeave,
  createOnLeave,
  updateOnLeave,
  deleteOnLeave,
} = require("../controllers/onLeaveManagerController");

const router = express.Router();

// Route to get all on leave records
router.route("/").get(getOnLeave);
// Route to create a new on leave record
router.route("/").post(createOnLeave);
// Route to update an existing on leave record by ID
router.route("/:id").put(updateOnLeave);
// Route to delete an existing on leave record by ID
router.route("/:id").delete(deleteOnLeave);

module.exports = router;
