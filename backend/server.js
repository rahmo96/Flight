const express = require('express');
const cors = require('cors');
require('dotenv').config();
const flightRoutes = require('./routes/flights');
const bookingRoutes = require('./routes/bookings');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/flights', (req, res, next) => {
  console.log('Flight API request received');
  next();
}, flightRoutes);

// General error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message });
});
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
