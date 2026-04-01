const Booking = require('../models/Booking');

const REQUIRED_FIELDS = ['destination', 'location', 'checkin', 'checkout', 'guests', 'roomType', 'totalPrice'];

async function createBooking(req, res) {
  try {
    const missing = REQUIRED_FIELDS.filter(f => !req.body[f] && req.body[f] !== 0);
    if (missing.length > 0) {
      return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
    }

    const { destination, location, checkin, checkout, guests, roomType, totalPrice } = req.body;

    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);

    if (isNaN(checkinDate) || isNaN(checkoutDate)) {
      return res.status(400).json({ message: 'checkin and checkout must be valid dates' });
    }
    if (checkinDate >= checkoutDate) {
      return res.status(400).json({ message: 'checkin must be before checkout' });
    }

    const booking = await Booking.create({
      userId: req.userId,
      destination,
      location,
      checkin: checkinDate,
      checkout: checkoutDate,
      guests,
      roomType,
      totalPrice,
    });

    return res.status(201).json(booking);
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getBookings(req, res) {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.userId },
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json(bookings);
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function cancelBooking(req, res) {
  try {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.userId !== req.userId) {
      return res.status(403).json({ message: 'Forbidden: you do not own this booking' });
    }

    await booking.destroy();
    return res.status(200).json({ message: 'Booking cancelled' });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { createBooking, getBookings, cancelBooking };
