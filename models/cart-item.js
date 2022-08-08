const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Cart = sequelize.define("cartItem", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  quantity : Sequelize.INTEGER
});

module.exports = Cart;
