const express = require("express");
const {
  create,
  index,
  show,
  update,
  destroy,
} = require("../controllers/category.controller");
const { protect, permission } = require("../middlewares/auth");
const router = express.Router();

router.get("/", index);
router.get("/:id", show);

router.use(protect, permission("admin"));
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", destroy);

module.exports = router;
