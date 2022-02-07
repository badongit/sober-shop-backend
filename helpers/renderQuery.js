module.exports = (query) => {
  let options = {};
  const { limit = 10, page = 1, getAll = 0 } = query;

  if (!getAll) {
    options.limit = +limit;
    options.offset = (+page - 1) * +limit;
  }

  options.where = { ...query };
  const removeFields = ["sort", "limit", "page", "getAll"];
  removeFields.forEach((field) => delete options.where[field]);

  options.order = [];
  if (query.sort) {
    const sortBy = query.sort.split(",");

    sortBy.forEach((field) => {
      if (field.startsWith("-")) {
        options.order.push([field.substring(1), "DESC"]);
      } else {
        options.order.push([field, "ASC"]);
      }
    });
  } else {
    options.order.push(["id", "ASC"]);
  }

  return options;
};
