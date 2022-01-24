const errorHandle = require("../middlewares/errorHandle");

const routes = (app) => {
  app.use(errorHandle);

  app.get("*", (req, res) => {
    return res.status(404).json({
      success: false,
      message: "Not found",
    });
  });
};

module.exports = routes;
