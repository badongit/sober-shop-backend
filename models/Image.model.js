const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    static associate(models) {
      this.belongsTo(models.Product, {
        foreignKey: "imageableId",
        constraints: false,
        as: "product",
      });

      this.belongsTo(models.Item, {
        foreignKey: "imageableId",
        constraints: false,
        as: "item",
      });

      this.belongsTo(models.Feedback, {
        foreignKey: "imageableId",
        constraints: false,
        as: "feedback",
      });
    }
  }

  Image.init(
    {
      source: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter source image",
          },
        },
      },
      imageable: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter imageable",
          },
        },
      },
      imageableId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter imageable id",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Image",
    }
  );

  return Image;
};
