const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Booking = sequelize.define('Booking', {
  id:          { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId:      { type: DataTypes.INTEGER, allowNull: false },
  destination: { type: DataTypes.STRING, allowNull: false },
  location:    { type: DataTypes.STRING, allowNull: false },
  checkin:     { type: DataTypes.DATE, allowNull: false },
  checkout:    { type: DataTypes.DATE, allowNull: false },
  guests:      { type: DataTypes.INTEGER, allowNull: false },
  roomType:    { type: DataTypes.ENUM('Standard', 'Deluxe', 'Suite', 'Villa'), allowNull: false },
  totalPrice:  { type: DataTypes.STRING, allowNull: false },
  status:      { type: DataTypes.STRING, defaultValue: 'Confirmed' },
}, {
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: false,
});

User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

module.exports = Booking;
