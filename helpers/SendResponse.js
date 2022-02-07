const sendResponse = (res, message, statusCode, data, pagination) => {
  const response = {
    message: message || "",
    success: statusCode < 400,
    data: data || {},
  };

  if (pagination) {
    response.pagination = pagination;
  }

  res.status(statusCode).json(response);
};

module.exports = sendResponse;
