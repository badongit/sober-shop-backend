const errorHandle = require("../middlewares/errorHandle");
const routers = require("../constants/routers");

const routes = (app) => {
  routers.map((route) => {
    app.use(`/api/${route.endpoint}`, route.router);
  });

  app.use(errorHandle);

  app.get("*", (req, res) => {
    return res.status(404).json({
      success: false,
      message: "Not found",
    });
  });
};

module.exports = routes;
