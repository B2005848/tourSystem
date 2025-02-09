const express = require("express");
const {
  getDepotShips,
  createDepotShip,
  updateDepotShip,
  deleteDepotShip,
} = require("../controllers/depotShipsController");
const router = express.Router();

router.route("/").get(getDepotShips).post(createDepotShip);
router.route("/:id").put(updateDepotShip).delete(deleteDepotShip);

module.exports = router;
