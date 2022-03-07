const express = require("express");
const {
  index,
  add,
  update,
  destroy,
} = require("../controllers/cart.controller");
const router = express.Router();
const { protect, permission } = require("../middlewares/auth");

router.use(protect, permission("user"));
router.get("/", index);
router.post("/", add);
router.put("/:cartId", update);
router.delete("/:cartId", destroy);

module.exports = router;
