"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RechargeHistory extends Model {
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
    }
  }
  RechargeHistory.init(
    {
      money: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter money",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "RechargeHistory",
    }
  );
  return RechargeHistory;
};
