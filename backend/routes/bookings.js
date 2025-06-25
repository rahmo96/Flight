const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookingsController');

// Get all bookings
router.get('/', bookingsController.getAllBookings);

// Get a single booking by ID
router.get('/:id', bookingsController.getBookingById);

// Create a new booking
router.post('/', bookingsController.createBooking);

// Delete a booking
router.delete('/:id', bookingsController.deleteBooking);

//Get all users bookings
router.get('/by-email/:email', bookingsController.getBookingByEmail);

module.exports = router;
