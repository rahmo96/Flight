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
  }, {
    tableName: 'flights',    // טבלת Supabase בפועל
    timestamps: false        // אם אין createdAt/updatedAt
  });

  Flight.associate = (models) => {
    Flight.hasMany(models.Booking, {
      foreignKey: 'flight_number',
      sourceKey: 'flight_number'
    });
  };

  return Flight;
};
