"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.Feedback, {
        foreignKey: "orderId",
        as: "feedback",
      });

      this.belongsTo(models.Order, {
        foreignKey: "orderId",
        onDelete: "cascade",
      });

      this.belongsTo(models.Item, {
        foreignKey: "itemId",
      });
    }
  }
  OrderDetail.init(
    {
      price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
          notNull: "Please enter price",
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: "Please enter quantity",
        },
      },
    },
    {
      sequelize,
      modelName: "OrderDetail",
    }
  );
  return OrderDetail;
};
