const express = require("express");
const {
  index,
  show,
  create,
  update,
  destroy,
} = require("../controllers/item.controller");
const router = express.Router({ mergeParams: true });

router.get("/:itemId", show);
router.get("/", index);
router.post("/", create);
router.put("/:itemId", update);
router.delete("/:itemId", destroy);

module.exports = router;
