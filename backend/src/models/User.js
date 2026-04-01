const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  firstName:    { type: DataTypes.STRING, allowNull: false },
  lastName:     { type: DataTypes.STRING, allowNull: false },
  email:        { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  country:      { type: DataTypes.STRING, allowNull: false },
  imageUrl:     { type: DataTypes.STRING, defaultValue: '' },
}, {
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: false,
});

module.exports = User;
