const { Booking, Flight, sequelize } = require('../models');


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
  const t = await sequelize.transaction();
  
  try {
    const { flight_number, passenger_name, passenger_email, ticket_sold = 1 } = req.body;
    
    if (!flight_number) {
      return res.status(400).json({ error: 'Flight ID is required' });
    }
    
    // Check if seats are available
    const flight = await Flight.findByPk(flight_number, { transaction: t });
    
    if (!flight) {
      await t.rollback();
      return res.status(404).json({ error: 'Flight not found' });
    }
    
    // Make sure we have enough seats
    if (flight.available_seats < ticket_sold) {
      await t.rollback();
      return res.status(400).json({ 
        error: `Not enough seats available. Only ${flight.available_seats} seats left.` 
      });
    }
    
    // Update available seats
    await flight.update(
      { available_seats: flight.available_seats - ticket_sold },
      { transaction: t }
    );
    
    // Create booking
    const booking = await Booking.create({
      flight_number: flight_number,
      passenger_name: passenger_name,
      passenger_email: passenger_email,
      ticket_sold: ticket_sold
    }, { transaction: t });
    
    await t.commit();
    res.status(201).json(booking);
  } catch (err) {
    await t.rollback();
    console.error('Booking creation error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBooking = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const booking = await Booking.findByPk(req.params.id, { 
      transaction: t 
    });
    
    if (!booking) {
      await t.rollback();
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Increase available seats back
    const flight = await Flight.findByPk(booking.flight_number, { 
      transaction: t 
    });
    
    if (flight) {
      await flight.update(
        { available_seats: flight.available_seats + booking.ticket_sold },
        { transaction: t }
      );
    }
    
    await booking.destroy({ transaction: t });
    await t.commit();
    res.status(204).send();
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: err.message });
  }
};


// Add code to handle booking cancellations (optionally increasing available seats back)
exports.deleteBooking = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const booking = await Booking.findByPk(req.params.id, { 
      transaction: t 
    });
    
    if (!booking) {
      await t.rollback();
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Increase available seats back
    const flight = await Flight.findByPk(booking.flight_number, { 
      transaction: t 
    });
    
    if (flight) {
      await flight.update(
        { available_seats: flight.available_seats + 1 },
        { transaction: t }
      );
    }
    
    await booking.destroy({ transaction: t });
    await t.commit();
    res.status(204).send();
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: err.message });
  }
};
