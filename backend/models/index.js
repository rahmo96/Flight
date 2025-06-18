const { Sequelize, DataTypes } = require('sequelize');

// קישור לבסיס הנתונים דרך הסביבה
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

// ייבוא המודל
db.Flight = require('./flight')(sequelize, DataTypes);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
