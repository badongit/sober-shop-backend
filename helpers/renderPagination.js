function renderPagination(page, limit, total) {
  return {
    page: +page || +process.env.PAGE,
    limit,
    total,
    totalPage: Math.ceil(total / limit),
  };
}

module.exports = renderPagination;
