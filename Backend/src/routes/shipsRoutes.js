const express = require("express");
const {
  getShips,
  createShip,
  updateShip,
  deleteShip,
  searchShip,
} = require("../controllers/shipsController");
const router = express.Router();

router.route("/").get(getShips).post(createShip);
router.route("/:id").put(updateShip).delete(deleteShip);
router.route("/search").get(searchShip);

module.exports = router;
