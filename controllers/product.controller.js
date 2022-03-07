const { Op } = require("sequelize");
const { upload, destroy } = require("../config/cloudinary");
const msgEnum = require("../enum/msg.enum");
const statusCodeEnum = require("../enum/status-code.enum");
const ErrorResponse = require("../helpers/ErrorResponse");
const renderPagination = require("../helpers/renderPagination");
const renderQuery = require("../helpers/renderQuery");
const sendResponse = require("../helpers/SendResponse");
const asyncHandle = require("../middlewares/asyncHandle");
const { Product, sequelize, Image } = require("../models");
const { ERROR_NOT_FOUND } = require("../enum/error.enum");

module.exports = {
  //@route [POST] /
  create: asyncHandle(async (req, res, next) => {
    const { images } = req.files;
    const transaction = await sequelize.transaction();
    let imagesData;
    let product;

    try {
      product = await Product.create(req.body, {
        fields: ["name", "price", "description", "discount", "categoryId"],
        transaction,
      });

      const uploadResponse = await Promise.all(
        images.map(async (image, index) => {
          return await upload(image, {
            folder: "sober-shop/product",
            filename_override: `product-${product.id}-${index}`,
          });
        })
      );

      imagesData = uploadResponse.map((res) => ({
        source: res.secure_url,
        publicId: res.public_id,
      }));

      await product.addImages(imagesEntity, { transaction });

      await transaction.commit();
    } catch (error) {
      await Promise.all(
        imagesData.map(async (imageData) => {
          await destroy(imageData.publicId);
        })
      );

      await transaction.rollback();
      return next(error);
    }

    await product.reload({ include: ["images", "category"] });

    return sendResponse(res, msgEnum.SUCCESS, statusCodeEnum.CREATED, {
      product,
    });
  }),

  // @route [GET] /
  index: asyncHandle(async (req, res, next) => {
    const options = renderQuery(req.query);

    if (options.where.keywords) {
      options.where.name = {
        [Op.substring]: options.where.keywords,
      };

      delete options.where.keywords;
    }

    if (options.where.minPrice) {
      options.where.price = {
        [Op.gte]: options.where.minPrice,
      };

      delete options.where.keywords;
    }

    if (options.where.maxPrice) {
      options.where.price = {
        ...options.where.price,
        [Op.lte]: options.where.maxPrice,
      };

      delete options.where.maxPrice;
    }

    const products = await Product.findAll({
      ...options,
      include: ["images", "category"],
    });

    const count = await Product.count(options);

    let pagination;
    if (!req.query.getAll) {
      pagination = renderPagination(req.query.page, options.limit, count);
    }

    return sendResponse(
      res,
      msgEnum.SUCCESS,
      statusCodeEnum.OK,
      { products },
      pagination
    );
  }),

  // @route [GET] /:id
  show: asyncHandle(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: { all: true },
    });

    if (!product) {
      return next(ERROR_NOT_FOUND);
    }

    return sendResponse(res, msgEnum.SUCCESS, statusCodeEnum.OK, { product });
  }),

  // @route [PUT] /:id
  update: asyncHandle(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByPk(id, { include: { all: true } });
    const transaction = await sequelize.transaction();

    let imagesData;

    if (!product) {
      return next(ERROR_NOT_FOUND);
    }

    try {
      if (req.files?.images) {
        const uploadResponse = await Promise.all(
          req.files.images.map(async (image, index) => {
            return await upload(image, {
              folder: "sober-shop/product",
              filename_override: `product-${product.id}-${index}`,
            });
          })
        );

        imagesData = uploadResponse.map((res) => ({
          source: res.secure_url,
          publicId: res.public_id,
        }));

        const imagesEntity = await Image.bulkCreate(imagesData, {
          transaction,
        });

        await product.addImages(imagesEntity, { transaction });
      }

      await product.update(req.body, {
        fields: ["name", "description", "price", "discount"],
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      if (imagesData) {
        await Promise.all(
          imagesData.map(async (imageData) => {
            await destroy(imageData.publicId);
          })
        );
      }

      return next(error);
    }

    await product.reload({ include: { all: true } });

    return sendResponse(res, msgEnum.SUCCESS, statusCodeEnum.OK, { product });
  }),

  // @route [DELETE] /:productId/images/:imageId
  removeImage: asyncHandle(async (req, res, next) => {
    const { productId, imageId } = req.params;

    const image = await Image.findByPk(imageId);

    if (!image) {
      return next(ERROR_NOT_FOUND);
    }

    await Image.destroy({ where: { id: imageId, imageableId: productId } });

    const product = await Product.findByPk(productId, {
      include: { all: true },
    });

    await destroy(image.publicId);

    if (!product) {
      return next(ERROR_NOT_FOUND);
    }

    return sendResponse(res, msgEnum.SUCCESS, statusCodeEnum.OK, { product });
  }),

  // @route [DELETE] /:id
  destroy: asyncHandle(async (req, res, next) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();

    const product = await Product.findByPk(id, { include: "images" });

    if (!product) {
      return next(ERROR_NOT_FOUND);
    }

    try {
      await Image.destroy({ where: { imageableId: id }, transaction });
      await Product.destroy({ where: { id }, transaction });
      await Promise.all(
        product.images.map(async (image) => {
          return await destroy(image.publicId);
        })
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      return next(error);
    }

    return sendResponse(res, msgEnum.SUCCESS, statusCodeEnum.OK);
  }),
};
