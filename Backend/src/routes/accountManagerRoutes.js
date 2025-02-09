const express = require("express");
const {
  createAccount,
  checkLogin,
  refreshToken,
} = require("../controllers/accountManagerController");
const router = express.Router();

router.route("/create").post(createAccount);
router.route("/login").post(checkLogin);
router.route("/refresh-token").post(refreshToken);

module.exports = router;
