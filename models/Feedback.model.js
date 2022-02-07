"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Image, {
        foreignKey: "imageableId",
        constraints: false,
        scope: {
          imageable: "feedback",
        },
        as: "images",
      });

      this.belongsTo(models.OrderDetail, {
        foreignKey: "orderDetailId",
        onDelete: "cascade",
      });

      this.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "cascade",
      });
    }
  }
  Feedback.init(
    {
      comment: DataTypes.STRING,
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter rating",
          },
          len: {
            args: [1, 5],
            msg: "Rating must be from 1 to 5",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Feedback",
    }
  );
  return Feedback;
};
