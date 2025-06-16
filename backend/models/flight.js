module.exports = (sequelize, DataTypes) => {
  const Flight = sequelize.define('Flight', {
    flightNumber: DataTypes.STRING,
    departure: DataTypes.STRING,
    destination: DataTypes.STRING,
    departureTime: DataTypes.DATE,
    arrivalTime: DataTypes.DATE,
    price: DataTypes.FLOAT,
  });

  return Flight;
};
