const express = require('express');
const cors = require('cors');
const db = require('./models'); // מייבא את Sequelize ואת המודלים

const flightsRoutes = require('./routes/flightsRoutes');
const bookingsRoutes = require('./routes/bookingsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/flights', flightsRoutes);
app.use('/api/bookings', bookingsRoutes);

app.get('/', (req, res) => {
  res.send('Flight Booking API is running.');
});

db.sequelize
  .sync()
  .then(() => {
    console.log('Database connected and synced');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to DB:', err);
  });
