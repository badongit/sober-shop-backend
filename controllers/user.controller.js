const renderQuery = require("../helpers/renderQuery");
const asyncHandle = require("../middlewares/asyncHandle");
const { User } = require("../models");
const renderPagination = require("../helpers/renderPagination");
const sendResponse = require("../helpers/SendResponse");
const msgEnum = require("../enum/msg.enum");
const statusCodeEnum = require("../enum/status-code.enum");
const ErrorResponse = require("../helpers/ErrorResponse");

module.exports = {
  //@route [GET] /
  getUsers: asyncHandle(async (req, res, next) => {
    const options = renderQuery(req.query);

    const { count, rows: users } = await User.scope(
      "forClient"
    ).findAndCountAll(options);

    let pagination;
    if (!req.query.getAll) {
      pagination = renderPagination(req.query.page, options.limit, count);
    }

    return sendResponse(
      res,
      msgEnum.SUCCESS,
      statusCodeEnum.OK,
      { users },
      pagination
    );
  }),

  //@route [POST] /:userId/status
  updateStatusUser: asyncHandle(async (req, res, next) => {
    const { status } = req.body;
    const { userId } = req.params;

    if (!status || !userId) {
      return next(
        new ErrorResponse(msgEnum.BAD_REQUEST, statusCodeEnum.BAD_REQUEST)
      );
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return next(
        new ErrorResponse(msgEnum.NOT_FOUND, statusCodeEnum.NOT_FOUND)
      );
    }

    await user.update({ status });

    return sendResponse(res, msgEnum.SUCCESS, statusCodeEnum.OK);
  }),

  //@route [DELETE] /:userId
  deleteUser: asyncHandle(async (req, res, next) => {
    const { userId } = req.params;

    if (!userId) {
      return next(
        new ErrorResponse(msgEnum.BAD_REQUEST, statusCodeEnum.BAD_REQUEST)
      );
    }

    await User.destroy({ where: { id: userId } });

    return sendResponse(res, msgEnum.SUCCESS, statusCodeEnum.OK);
  }),
};
