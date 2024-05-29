const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('./userModel');

const Item = sequelize.define('Item', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    startingPrice: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    currentPrice: {
      type: DataTypes.DECIMAL,
      defaultValue: DataTypes.VIRTUAL('startingPrice'),
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });
  
  module.exports = { Item };