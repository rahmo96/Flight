const { Flight } = require('../models');

exports.getAllFlights = async (req, res) => {
  const flights = await Flight.findAll();
  res.json(flights);
};

exports.createFlight = async (req, res) => {
  const flight = await Flight.create(req.body);
  res.status(201).json(flight);
};
