module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    flight_number: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'flights',
        key: 'flight_number'
      }
    },
    passenger_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    passenger_email: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    booking_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'bookings',
    timestamps: false
  });

  Booking.associate = (models) => {
    Booking.belongsTo(models.Flight, {
      foreignKey: 'flight_number',
      targetKey: 'flight_number'
    });
  };

  return Booking;
};
