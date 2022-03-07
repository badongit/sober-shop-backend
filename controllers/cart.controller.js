const { Cart, Item, Product } = require("../models");
const asyncHandle = require("../middlewares/asyncHandle");
const sendResponse = require("../helpers/sendResponse");
const msgEnum = require("../enum/msg.enum");
const statusCodeEnum = require("../enum/status-code.enum");
const { ERROR_NOT_FOUND } = require("../enum/error.enum");

module.exports = {
  // @route [POST] /
  add: asyncHandle(async (req, res, next) => {
    const { quantity, itemId } = req.body;
    let cart;
    cart = await Cart.findOne({ itemId });

    if (cart) {
      await cart.increment({ quantity });
    } else {
      cart = await Cart.create(
        { ...req.body, userId: req.user.id, quantity: req.body.quantity },
        { fields: ["userId", "itemId", "quantity"] }
      );
    }

    await cart.reload({
      include: [
        {
          model: Item,
          as: "item",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    return sendResponse(res, msgEnum.SUCCESS, statusCodeEnum.CREATED, { cart });
  }),

  // @route [GET] /
  index: asyncHandle(async (req, res, next) => {
    const carts = await Cart.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Item,
          as: "item",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    return sendResponse(res, msgEnum.SUCCESS, statusCodeEnum.OK, { carts });
  }),

  // @route [PUT] /:cartId
  update: asyncHandle(async (req, res, next) => {
    const { cartId } = req.params;

    const cart = await Cart.findByPk(cartId, {
      include: [
        {
          model: Item,
          as: "item",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    if (!cart) {
      return next(ERROR_NOT_FOUND);
    }

    await cart.update({ quantity: req.body.quantity });

    return sendResponse(res, msgEnum.SUCCESS, statusCodeEnum.OK, { cart });
  }),

  // @route [DELETE] /:cartId
  destroy: asyncHandle(async (req, res, next) => {
    const { cartId } = req.params;

    const cart = await Cart.findByPk(cartId);

    if (!cart) {
      return next(ERROR_NOT_FOUND);
    }

    await cart.destroy();

    return sendResponse(res, msgEnum.SUCCESS, statusCodeEnum.OK);
  }),
};
