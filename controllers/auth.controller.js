const msgEnum = require("../enum/msg.enum");
const statusCodeEnum = require("../enum/status-code.enum");
const ErrorResponse = require("../helpers/ErrorResponse");
const sendResponse = require("../helpers/SendResponse");
const asyncHandle = require("../middlewares/asyncHandle");
const { User, sequelize, RechargeHistory } = require("../models");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const redisClient = require("../config/redisClient");
const getResetPasswordToken = require("../helpers/getResetPasswordToken");
const sendMail = require("../helpers/sendMail");

module.exports = {
  //@route [POST] /register
  register: asyncHandle(async (req, res, next) => {
    const { username, password, email } = req.body;

    const user = await User.create(req.body);

    const accessToken = user.getAccessToken();
    const refreshToken = await user.getRefreshToken();

    return sendResponse(res, msgEnum.SUCCESS, statusCodeEnum.CREATED, {
      accessToken,
      refreshToken,
    });
  }),

  //@route [POST] /login
  login: asyncHandle(async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return next(
        new ErrorResponse(msgEnum.BAD_REQUEST, statusCodeEnum.BAD_REQUEST)
      );
    }

    const user = await User.findOne({
      where: {
        username: {
          [Op.eq]: username,
        },
      },
    });

    if (!user) {
      return next(
        new ErrorResponse(msgEnum.NOT_FOUND, statusCodeEnum.NOT_FOUND)
      );
    }

    const isMatched = await user.matchPassword(password);

    if (!isMatched) {
      return next(
        new ErrorResponse(msgEnum.WRONG_PASSWORD, statusCodeEnum.BAD_REQUEST)
      );
    }

    const accessToken = user.getAccessToken();
    const refreshToken = await user.getRefreshToken();

    return sendResponse(res, msgEnum.SUCCESS, statusCodeEnum.OK, {
      accessToken,
      refreshToken,
    });
  }),

  //@route [POST]
  sendToken: asyncHandle(async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(
        new ErrorResponse(msgEnum.UNAUTHORIZED, statusCodeEnum.UNAUTHORIZED)
      );
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const tokenRestored = await redisClient.get(decoded.id.toString());

    if (!tokenRestored || tokenRestored !== refreshToken) {
      return next(
        new ErrorResponse(msgEnum.UNAUTHORIZED, statusCodeEnum.UNAUTHORIZED)
      );
    }

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return next(
        new ErrorResponse(msgEnum.UNAUTHORIZED, statusCodeEnum.UNAUTHORIZED)
      );
    }

    const accessToken = user.getAccessToken();

    return sendResponse(res, msgEnum.SUCCESS, statusCodeEnum.OK, {
      accessToken,
    });
  }),

  //@route [GET] /me
  getMe: asyncHandle(async (req, res, next) => {
    const user = await User.scope("forClient").findByPk(req.user.id);

    if (!user) {
      return next(
        new ErrorResponse(msgEnum.NOT_FOUND, statusCodeEnum.NOT_FOUND)
      );
    }

    return sendResponse(res, msgEnum.SUCCESS, statusCodeEnum.OK, { user });
  }),

  //@route [PUT] /profile
  updateProfile: asyncHandle(async (req, res, next) => {
    await req.user.update(req.body, {
      fields: ["email", "phone", "address", "displayName"],
    });

    const newUser = await User.scope("forClient").findByPk(req.user.id);

    return sendResponse(res, msgEnum.SUCCESS, statusCodeEnum.OK, {
      user: newUser,
    });
  }),

  //@route [PUT] /recharge
  recharge: asyncHandle(async (req, res, next) => {
    const transaction = await sequelize.transaction();
    const { money } = await req.body;

    if (!money || money < 0) {
      return next(
        new ErrorResponse(msgEnum.BAD_REQUEST, statusCodeEnum.BAD_REQUEST)
      );
    }

    try {
      await User.increment(
        { balance: money },
        { where: { id: req.user.id }, transaction }
      );

      const rechargeHistory = await RechargeHistory.create(
        { money, userId: req.user.id },
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      return next(error);
    }

    return sendResponse(res, msgEnum.SUCCESS, statusCodeEnum.OK);
  }),

  //@route [POST] /forgot-password
  forgotPassword: asyncHandle(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
      return next(
        new ErrorResponse(msgEnum.BAD_REQUEST, statusCodeEnum.BAD_REQUEST)
      );
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return next(
        new ErrorResponse(msgEnum.NOT_FOUND, statusCodeEnum.NOT_FOUND)
      );
    }

    const { resetPasswordToken, resetPasswordExpire } = getResetPasswordToken();

    await user.update({
      resetPasswordExpire,
      resetPasswordToken: resetPasswordToken.toString(),
    });

    const resetURL = `${process.env.CLIENT_URI}/${resetPasswordToken}`;
    const message = `Vui lòng click vào đây ${resetURL} để đặt lại mật khẩu. Link tồn tại trong ${process.env.RESET_TOKEN_EXPIRE} phút.`;

    try {
      await sendMail({ subject: "Forgot password ?", text: message, email });

      return sendResponse(res, msgEnum.SUCCESS, statusCodeEnum.OK);
    } catch (error) {
      await user.update({
        resetPasswordExpire: null,
        resetPasswordToken: null,
      });
      return next(error);
    }
  }),

  //@route [POST] /reset-password/:resetPasswordToken
  resetPassword: asyncHandle(async (req, res, next) => {
    const { resetPasswordToken } = req.params;
    const { password } = req.body;

    if (!resetPasswordToken || !password) {
      return next(
        new ErrorResponse(msgEnum.BAD_REQUEST, statusCodeEnum.BAD_REQUEST)
      );
    }

    const user = await User.findOne({
      where: {
        resetPasswordToken,
        resetPasswordExpire: {
          [Op.gt]: Date.now(),
        },
      },
    });

    if (!user) {
      return next(
        new ErrorResponse(msgEnum.BAD_REQUEST, statusCodeEnum.BAD_REQUEST)
      );
    }

    await user.update({
      password,
      resetPasswordToken: null,
      resetPasswordExpire: null,
    });

    return sendResponse(res, msgEnum.SUCCESS, statusCodeEnum.OK);
  }),

  //@route [POST] /change-password
  changePassword: asyncHandle(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return next(
        new ErrorResponse(msgEnum.BAD_REQUEST, statusCodeEnum.BAD_REQUEST)
      );
    }

    const isMatched = await req.user.matchPassword(oldPassword);

    if (!isMatched) {
      return next(
        new ErrorResponse(msgEnum.WRONG_PASSWORD, statusCodeEnum.BAD_REQUEST)
      );
    }

    await req.user.update({ password: newPassword });

    return sendResponse(res, msgEnum.SUCCESS, statusCodeEnum.OK);
  }),
};
