const { Flight } = require('../models');

exports.getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.findAll();
    res.json(flights);
  } catch (err) {
    console.error('Error fetching flights:', err);
    res.status(500).json({ error: err.message });
  }
};


exports.createFlight = async (req, res) => {
  const flight = await Flight.create(req.body);
  res.status(201).json(flight);
};
