module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    passengerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    flightNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    seats: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  });

  return Booking;
};
