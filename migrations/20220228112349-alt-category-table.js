"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Categories", "image");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Categories", "image", {
      type: Sequelize.STRING,
    });
  },
};
