const express = require('express');
const cors = require('cors');
require('dotenv').config();
const flightRoutes = require('./routes/flights');
const bookingRoutes = require('./routes/bookings');
const userRoutes = require('./routes/users');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/flights', (req, res, next) => {
  console.log('Flight API request received');
  next();
}, flightRoutes);

app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);


// General error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
