const express = require("express");
const router = express.Router();
const {
  create,
  index,
  show,
  update,
  removeImage,
  destroy,
} = require("../controllers/product.controller");
const apiEnum = require("../enum/api.enum");
const { protect, permission } = require("../middlewares/auth");
const itemRouter = require("./item.router");

router.get("/", index);
router.get("/:id", show);
router.use(protect, permission("admin"));
router.use(`/:productId/${apiEnum.ITEMS}`, itemRouter);
router.post("/", create);
router.put("/:id", update);
router.delete("/:productId/images/:imageId", removeImage);
router.delete("/:id", destroy);

module.exports = router;
