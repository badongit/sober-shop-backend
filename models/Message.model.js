"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: "senderId",
        onDelete: "cascade",
      });

      this.belongsTo(models.Conversation, {
        foreignKey: "conversationId",
        onDelete: "cascade",
      });
    }
  }
  Message.init(
    {
      text: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter your message",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Message",
    }
  );
  return Message;
};
