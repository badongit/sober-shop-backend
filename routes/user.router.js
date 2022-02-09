const express = require("express");
const router = express.Router();
const { protect, permission } = require("../middlewares/auth");
const {
  getUsers,
  updateStatusUser,
  deleteUser,
} = require("../controllers/user.controller");

router.use(protect, permission("admin"));

router.get("/", getUsers);
router.post("/:userId/status", updateStatusUser);
router.delete("/:userId", deleteUser);

module.exports = router;
