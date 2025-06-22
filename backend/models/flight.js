module.exports = (sequelize, DataTypes) => {
  const Flight = sequelize.define('Flight', {
    flight_number: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    departure: DataTypes.STRING,
    destination: DataTypes.STRING,
    departure_time: DataTypes.DATE,
    arrival_time: DataTypes.DATE,
    price: DataTypes.FLOAT,
    capacity: {
      type: DataTypes.INTEGER,
      defaultValue: 100
    },
    available_seats: {
      type: DataTypes.INTEGER,
      defaultValue: 100
    }
  }, {
    tableName: 'flights',
    timestamps: false
  });

  Flight.associate = (models) => {
    Flight.hasMany(models.Booking, {
      foreignKey: 'flight_number',
      sourceKey: 'flight_number'
    });
  };

  return Flight;
};
