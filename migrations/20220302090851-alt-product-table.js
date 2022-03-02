"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Products", "rating", {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Products", "rating", {
      type: Sequelize.DECIMAL(5, 1),
      allowNull: false,
      defaultValue: 0,
    });
  },
};
