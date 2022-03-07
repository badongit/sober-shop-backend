const ErrorResponse = require("../helpers/ErrorResponse");
const msgEnum = require("./msg.enum");
const statusCodeEnum = require("./status-code.enum");

module.exports = {
  ERROR_NOT_FOUND: new ErrorResponse(
    msgEnum.NOT_FOUND,
    statusCodeEnum.NOT_FOUND
  ),
  ERROR_BAD_REQUEST: new ErrorResponse(
    msgEnum.BAD_REQUEST,
    statusCodeEnum.BAD_REQUEST
  ),
};
