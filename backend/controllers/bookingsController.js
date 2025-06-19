const { Booking, Flight } = require('../models');

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({ include: Flight });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, { include: Flight });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { flight_number, passenger_name, passenger_email } = req.body;
    
    if (!flight_number) {
      return res.status(400).json({ error: 'Flight ID is required' });
    }
    
    const booking = await Booking.create({
      flight_number: flight_number,
      passenger_name: passenger_name,
      passenger_email: passenger_email
      // booking_date will be automatically set by default
    });
    
    res.status(201).json(booking);
  } catch (err) {
    console.error('Booking creation error:', err);
    res.status(500).json({ error: err.message });
  }
};



exports.deleteBooking = async (req, res) => {
  try {
    const deleted = await Booking.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
