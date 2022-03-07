const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate(models) {
      this.hasMany(models.Image, {
        foreignKey: "imageableId",
        constraints: false,
        scope: {
          imageable: "item",
        },
        as: "images",
      });

      this.hasMany(models.OrderDetail, {
        foreignKey: "itemId",
        as: "orderDetails",
      });

      this.hasMany(models.Cart, {
        foreignKey: "itemId",
        as: "carts",
      });

      this.belongsTo(models.Product, {
        foreignKey: "productId",
        onDelete: "cascade",
        as: "product",
      });
    }
  }

  Item.init(
    {
      size: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter size",
          },
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: 0,
            msg: "Quantity must be greater than 0",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Item",
    }
  );

  return Item;
};
