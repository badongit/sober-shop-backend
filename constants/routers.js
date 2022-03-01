const APIEnum = require("../enum/api.enum");
const authRouter = require("../routes/auth.router");
const userRouter = require("../routes/user.router");
const categoryRouter = require("../routes/category.router");

const routers = [
  {
    router: authRouter,
    endpoint: APIEnum.AUTH,
  },
  {
    router: userRouter,
    endpoint: APIEnum.USERS,
  },
  {
    router: categoryRouter,
    endpoint: APIEnum.CATEGORIES,
  },
];

module.exports = routers;
