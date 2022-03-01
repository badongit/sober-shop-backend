const express = require("express");
const router = express.Router();
const {
  register,
  login,
  sendToken,
  getMe,
  updateProfile,
  recharge,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/token", sendToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:resetPasswordToken", resetPassword);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/recharge", protect, recharge);
router.post("/change-password", protect, changePassword);

module.exports = router;
