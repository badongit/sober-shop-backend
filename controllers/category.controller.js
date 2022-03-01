const asyncHandle = require("../middlewares/asyncHandle");
const { Category, Image, sequelize } = require("../models");
const { upload, destroy } = require("../config/cloudinary");
const ErrorResponse = require("../helpers/ErrorResponse");
const msgEnum = require("../enum/msg.enum");
const statusCodeEnum = require("../enum/status-code.enum");
const sendResponse = require("../helpers/SendResponse");

module.exports = {
  // @route [POST] /
  create: asyncHandle(async (req, res, next) => {
    const { name, description } = req.body;
    const { image } = req.files;
    const transaction = await sequelize.transaction();
    let category;
    let secureUrl;
    let publicId;

    try {
      category = await Category.create({ name, description }, { transaction });

      const uploadResponse = await upload(image, {
        folder: "sober-shop/category",
        filename_override: `category-${category.id}`,
      });

      secureUrl = uploadResponse.secure_url;
      publicId = uploadResponse.public_id;

      await category.createImage(
        { source: secureUrl, publicId },
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      console.log(error);
      await destroy(publicId);
      await transaction.rollback();
      return next(
        new ErrorResponse(msgEnum.BAD_REQUEST, statusCodeEnum.BAD_REQUEST)
      );
    }

    await category.reload({ include: "images" });

    return sendResponse(res, msgEnum.SUCCESS, statusCodeEnum.CREATED, {
      category,
    });
  }),

  // @route [GET] /
  index: asyncHandle(async (req, res, next) => {
    const categories = await Category.findAll({ include: "images" });

    return sendResponse(res, msgEnum.SUCCESS, statusCodeEnum.OK, {
      categories,
    });
  }),

  // @route [GET] /:id
  show: asyncHandle(async (req, res, next) => {
    const { id } = req.params;
    const category = await Category.findByPk(id, { include: "images" });

    if (!category) {
      return next(
        new ErrorResponse(msgEnum.NOT_FOUND, statusCodeEnum.NOT_FOUND)
      );
    }

    return sendResponse(res, msgEnum.SUCCESS, statusCodeEnum.OK, { category });
  }),

  // @route [PUT] /:id
  update: asyncHandle(async (req, res, next) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const transaction = await sequelize.transaction();

    const category = await Category.findByPk(id, { include: "images" });

    if (!category) {
      return next(
        new ErrorResponse(msgEnum.NOT_FOUND, statusCodeEnum.NOT_FOUND)
      );
    }

    const oldImages = await category.getImages();

    let secureUrl;
    let publicId;

    if (!category) {
      return next(
        new ErrorResponse(msgEnum.NOT_FOUND, statusCodeEnum.NOT_FOUND)
      );
    }

    try {
      if (req.files?.image) {
        const uploadResponse = await upload(req.files.image, {
          folder: "sober-shop/category",
          filename_override: `category-${category.id}`,
        });
        secureUrl = uploadResponse.secure_url;
        publicId = uploadResponse.public_id;

        await Image.destroy({
          where: {
            id: oldImages[0].dataValues.id,
          },
          transaction,
        });

        // await category.setImages([], { transaction });
        await category.createImage(
          { source: secureUrl, publicId },
          { transaction }
        );
      }

      if (name || description) {
        await category.update(req.body, {
          fields: ["name", "description"],
          transaction,
        });
      }

      await destroy(oldImages[0].dataValues.publicId);

      await transaction.commit();
    } catch (error) {
      console.log(error.message);
      await destroy(publicId);
      await transaction.rollback();
      return next(
        new ErrorResponse(msgEnum.BAD_REQUEST, statusCodeEnum.BAD_REQUEST)
      );
    }

    await category.reload({ include: "images" });

    return sendResponse(res, msgEnum.SUCCESS, statusCodeEnum.OK, { category });
  }),

  // @route [DELETE] /:id
  destroy: asyncHandle(async (req, res, next) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();

    const category = await Category.findByPk(id, { include: "images" });

    if (!category) {
      return next(
        new ErrorResponse(msgEnum.NOT_FOUND, statusCodeEnum.NOT_FOUND)
      );
    }

    try {
      await Image.destroy({ where: { imageableId: category.id }, transaction });
      await Category.destroy({ where: { id }, transaction });
      await destroy(category.images[0].publicId);
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      return next(error);
    }

    return sendResponse(res, msgEnum.SUCCESS, statusCodeEnum.OK);
  }),
};
