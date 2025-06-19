const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
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
