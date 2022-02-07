const msgEnum = require("../enum/msg.enum");
const statusCodeEnum = require("../enum/status-code.enum");
const ErrorResponse = require("../helpers/ErrorResponse");
const asyncHandle = require("./asyncHandle");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports.protect = asyncHandle(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new ErrorResponse(msgEnum.UNAUTHORIZED, statusCodeEnum.UNAUTHORIZED)
    );
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findByPk(decoded.id);

  if (!user) {
    return next(
      new ErrorResponse(msgEnum.UNAUTHORIZED, statusCodeEnum.UNAUTHORIZED)
    );
  }

  if (!user.isActived()) {
    return next(new ErrorResponse(msgEnum.INACTIVE, statusCodeEnum.FORBIDDEN));
  }

  req.user = user;
  next();
});

module.exports.permission =
  (...roles) =>
  (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        return next(
          new ErrorResponse(msgEnum.FORBIDDEN, statusCodeEnum.FORBIDDEN)
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
