const express = require('express');
const router = express.Router();
const flightsController = require('../controllers/flightsController');

router.get('/', flightsController.getAllFlights);

router.post('/', flightsController.createFlight);

module.exports = router;
