// backend/models/index.js
const { Sequelize, DataTypes } = require('sequelize');

// Determine if we're in test mode
const isTest = process.env.NODE_ENV === 'test';

// Use different connection options based on environment
const sequelize = isTest 
  ? new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:', // Use in-memory SQLite for testing
      logging: false
    })
  : new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    });

const db = {};

db.Flight = require('./flight')(sequelize, DataTypes);
db.Booking = require('./booking')(sequelize, DataTypes);

// Define associations if needed
db.Booking.belongsTo(db.Flight, { foreignKey: 'flight_number' });
db.Flight.hasMany(db.Booking, { foreignKey: 'flight_number' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
