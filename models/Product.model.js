const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      this.hasMany(models.Image, {
        foreignKey: "imageableId",
        constraints: false,
        scope: {
          imageable: "product",
        },
        as: "images",
      });

      this.hasMany(models.Item, {
        foreignKey: "productId",
        as: "items",
      });

      this.belongsTo(models.Category, {
        foreignKey: "categoryId",
        onDelete: "cascade",
        as: "category",
      });
    }
  }

  Product.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter product name",
          },
          notEmpty: {
            msg: "Please enter product name",
          },
        },
      },
      price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
          isGreaterThanZero(value) {
            if (+value < 0) {
              throw new Error("Price must be greater than 0");
            }
          },
          notNull: {
            msg: "Please enter price",
          },
        },
      },
      description: DataTypes.STRING,
      rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isFromZeroToFive(value) {
            if (+value < 0 || +value > 5) {
              throw new Error("Rating must be from 0 to 5");
            }
          },
        },
      },
      discount: {
        type: DataTypes.INTEGER,
        default: 0,
        validate: {
          isFromZeroToOneHundred(value) {
            if (+value < 0 || +value > 100) {
              throw new Error("Discount must be from 0 to 100");
            }
          },
        },
      },
      sold: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          isGreaterThanZero(value) {
            if (+value < 0) {
              throw new Error("Sold must be greater than 0");
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );

  return Product;
};
