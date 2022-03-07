"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "cascade",
      });

      this.belongsTo(models.Item, {
        foreignKey: "itemId",
        onDelete: "cascade",
        as: "item",
      });
    }
  }
  Cart.init(
    {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          isGreaterThanZero(value) {
            if (+value <= 0) {
              throw new Error("Quantity must be greater than 0");
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Cart",
    }
  );
  return Cart;
};
