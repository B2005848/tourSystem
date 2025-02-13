const express = require("express");
const {
  getShips,
  createShip,
  updateShip,
  deleteShip,
  searchShip,
  exportShips,
} = require("../controllers/shipsController");
const router = express.Router();

router.route("/").get(getShips).post(createShip);
router.route("/:id").put(updateShip).delete(deleteShip);
router.route("/search").get(searchShip);

router.route("/export").get(exportShips);

module.exports = router;
