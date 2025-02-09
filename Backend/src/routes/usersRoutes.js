// routes/userRoutes.js
const express = require("express");
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  searchUser,
} = require("../controllers/usersController");
const router = express.Router();

router.route("/").get(getUsers).post(createUser);
router.route("/:id").put(updateUser).delete(deleteUser);
router.route("/search").get(searchUser);
module.exports = router;
