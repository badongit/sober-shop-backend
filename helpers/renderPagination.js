module.exports = (page, limit, total) => {
  return {
    page: page || 1,
    limit,
    total,
    totalPage: Math.ceil(total / limit),
  };
};
