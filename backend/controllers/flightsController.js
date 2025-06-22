const { Flight } = require('../models');

exports.getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.findAll({
      where: {
        available_seats: {
          [require('sequelize').Op.gt]: 0 // Only show flights with available seats > 0
        }
      }
    });
    res.json(flights);
  } catch (err) {
    console.error('Error fetching flights:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.createFlight = async (req, res) => {
  // Make sure new flights have available_seats set to capacity if not specified
  if (req.body.capacity && !req.body.available_seats) {
    req.body.available_seats = req.body.capacity;
  }
  const flight = await Flight.create(req.body);
  res.status(201).json(flight);
};
