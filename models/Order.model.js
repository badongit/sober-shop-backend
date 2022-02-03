"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.OrderDetail, {
        foreignKey: "orderId",
        as: "orderDetails",
      });

      this.belongsTo(models.User, {
        foreignKey: "userId",
      });

      this.belongsTo(models.User, {
        foreignKey: "shipperId",
      });
    }
  }
  Order.init(
    {
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "in process",
        validate: {
          isIn: {
            args: [
              [
                "in process",
                "delivering",
                "delivered",
                "canceling",
                "cancelled",
              ],
            ],
            msg: "This status is not supported",
          },
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter your address",
          },
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter your phone number",
          },
          is: {
            args: /^[0-9]{10,11}$/,
            msg: "Entered wrong phone number format",
          },
        },
      },
      receiver: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter receiver's name",
          },
        },
      },
      deliveryCharges: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter delivery charges",
          },
        },
      },
      totalAmount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter total amount",
          },
        },
      },
      note: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
