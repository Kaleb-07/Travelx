const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const bookingController = require('../controllers/bookingController');

// Apply auth middleware to all routes on this router
router.use(auth);

router.get('/', bookingController.getBookings);
router.post('/', bookingController.createBooking);
router.delete('/:id', bookingController.cancelBooking);

module.exports = router;
