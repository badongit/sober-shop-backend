const APIEnum = require("../enum/api.enum");
const authRouter = require("../routes/auth.router");
const userRouter = require("../routes/user.router");

const routers = [
  {
    router: authRouter,
    endpoint: APIEnum.AUTH,
  },
  {
    router: userRouter,
    endpoint: APIEnum.USERS,
  },
];

module.exports = routers;
