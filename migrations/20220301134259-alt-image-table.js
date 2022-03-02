"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Images", "imageable", {
      type: Sequelize.STRING,
    });
    await queryInterface.changeColumn("Images", "imageableId", {
      type: Sequelize.INTEGER,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Images", "imageable", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn("Images", "imageableId", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
