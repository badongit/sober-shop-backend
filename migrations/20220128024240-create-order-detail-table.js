"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("OrderDetails", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      orderId: {
        allowNull: false,
        onDelete: "CASCADE",
        type: Sequelize.INTEGER,
        references: {
          key: "id",
          model: "Orders",
          as: "orderId",
        },
      },
      itemId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          key: "id",
          model: "Items",
          as: "itemId",
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("OrderDetails");
  },
};
