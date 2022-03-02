const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      this.hasMany(models.Product, {
        foreignKey: "categoryId",
        as: "products",
      });

      this.hasMany(models.Image, {
        foreignKey: "imageableId",
        constraints: false,
        scope: {
          imageable: "category",
        },
        as: "images",
      });
    }
  }

  Category.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: "Please enter category name",
          },
          notEmpty: {
            msg: "Please enter category name",
          },
        },
      },
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Category",
    }
  );

  return Category;
};
