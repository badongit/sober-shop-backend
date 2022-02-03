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
      });
    }
  }

  Product.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: "Please enter product name",
        },
      },
      price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
          min: {
            args: 0,
            msg: "Price must be greater than 0",
          },
          notNull: {
            msg: "Please enter price",
          },
        },
      },
      description: DataTypes.STRING,
      rating: {
        type: DataTypes.DECIMAL(5, 1),
        allowNull: false,
        defaultValue: 0,
        validate: {
          len: {
            args: [0, 5],
            msg: "Rating must be from 0 to 5",
          },
        },
      },
      discount: {
        type: DataTypes.INTEGER,
        default: 0,
        validate: {
          len: {
            args: [0, 100],
            msg: "Discount must be from 0 to 100",
          },
        },
      },
      sold: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: {
            args: 0,
            msg: "Sold products must be greater than 0",
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
