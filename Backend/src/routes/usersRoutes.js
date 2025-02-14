// routes/userRoutes.js
const express = require("express");
const {
  getAllUsers,
  getUserById,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  searchUser,
  exportUsersToExcel,
} = require("../controllers/usersController");

const router = express.Router();
router.get("/getallusers", getAllUsers);
router.get("/user_detail/:id", getUserById);
router.route("/").get(getUsers).post(createUser);
router.route("/:id").put(updateUser).delete(deleteUser);
router.route("/search").get(searchUser);

router.route("/export").get(exportUsersToExcel);
module.exports = router;
