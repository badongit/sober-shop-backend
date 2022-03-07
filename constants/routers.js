const APIEnum = require("../enum/api.enum");
const authRouter = require("../routes/auth.router");
const userRouter = require("../routes/user.router");
const categoryRouter = require("../routes/category.router");
const productRouter = require("../routes/product.router");
const cartRouter = require("../routes/cart.router");

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
  {
    router: productRouter,
    endpoint: APIEnum.PRODUCTS,
  },
  {
    router: cartRouter,
    endpoint: APIEnum.CARTS,
  },
];

module.exports = routers;
