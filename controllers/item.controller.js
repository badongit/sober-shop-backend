const msgEnum = require("../enum/msg.enum");
const statusCodeEnum = require("../enum/status-code.enum");
const ErrorResponse = require("../helpers/ErrorResponse");
const sendResponse = require("../helpers/SendResponse");
const asyncHandle = require("../middlewares/asyncHandle");
const { Item, Product } = require("../models");
const { Op } = require("sequelize");

module.exports = {
  // @route [POST] /
  create: asyncHandle(async (req, res, next) => {
    const { productId } = req.params;

    const oldItem = await Item.findOne({
      where: { productId, size: req.body.size },
    });

    if (oldItem) {
      return next(new ErrorResponse(msgEnum.EXISTED, statusCodeEnum.CONFLICT));
    }

    const item = await Item.create(
      { ...req.body, productId: +productId },
      {
        fields: ["size", "quantity", "productId"],
      }
    );

    return sendResponse(res, msgEnum.SUCCESS, statusCodeEnum.CREATED, { item });
  }),

  // @route [GET] /
  index: asyncHandle(async (req, res, next) => {
    const { productId } = req.params;
    console.log(productId);

    const items = await Item.findAll({
      where: { productId },
    });

    return sendResponse(res, msgEnum.SUCCESS, statusCodeEnum.OK, { items });
  }),

  // @route [GET] /:itemId
  show: asyncHandle(async (req, res, next) => {
    const { itemId } = req.params;

    const item = await Item.findByPk(itemId);

    if (!item) {
      return next(
        new ErrorResponse(msgEnum.NOT_FOUND, statusCodeEnum.NOT_FOUND)
      );
    }

    return sendResponse(res, msgEnum.SUCCESS, statusCodeEnum.OK, { item });
  }),

  // @route [PUT] /:itemId
  update: asyncHandle(async (req, res, next) => {
    const { itemId, productId } = req.params;

    const item = await Item.findByPk(itemId);

    const oldItem = await Item.findOne({
      where: {
        productId,
        size: req.body.size,
        id: {
          [Op.not]: itemId,
        },
      },
    });

    if (oldItem) {
      return next(new ErrorResponse(msgEnum.EXISTED, statusCodeEnum.CONFLICT));
    }

    if (!item) {
      return next(
        new ErrorResponse(msgEnum.NOT_FOUND, statusCodeEnum.NOT_FOUND)
      );
    }

    await item.update(req.body, { fields: ["size", "quantity"] });

    return sendResponse(res, msgEnum.SUCCESS, statusCodeEnum.OK, { item });
  }),

  // @route [DELETE] /:itemId
  destroy: asyncHandle(async (req, res, next) => {
    const { itemId } = req.params;

    const item = await Item.findByPk(itemId);

    if (!item) {
      return next(
        new ErrorResponse(msgEnum.NOT_FOUND, statusCodeEnum.NOT_FOUND)
      );
    }

    await item.destroy();

    return sendResponse(res, msgEnum.SUCCESS, statusCodeEnum.OK);
  }),
};
