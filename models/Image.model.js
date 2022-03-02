const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    static associate(models) {
      this.belongsTo(models.Product, {
        foreignKey: "imageableId",
        constraints: false,
        as: "product",
      });

      this.belongsTo(models.Feedback, {
        foreignKey: "imageableId",
        constraints: false,
        as: "feedback",
      });

      this.belongsTo(models.Category, {
        foreignKey: "imageableId",
        constraints: false,
        as: "category",
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
      },
      imageableId: {
        type: DataTypes.INTEGER,
      },
      publicId: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Image",
    }
  );

  return Image;
};
