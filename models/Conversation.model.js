"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Message, {
        foreignKey: "conversationId",
        as: "messages",
      });

      this.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "cascade",
      });
    }
  }
  Conversation.init(
    {},
    {
      sequelize,
      modelName: "Conversation",
    }
  );
  return Conversation;
};
