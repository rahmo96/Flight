module.exports = (sequelize, DataTypes) => {
  const Flight = sequelize.define('flights', {
    flight_number: DataTypes.STRING,
    departure: DataTypes.STRING,
    destination: DataTypes.STRING,
    departure_time: DataTypes.DATE,
    arrival_time: DataTypes.DATE,
    price: DataTypes.FLOAT,
  }, {
      tableName:'flights',
      timestamps: false
  });
  

  return Flight;
};
