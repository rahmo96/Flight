// backend/tests/setup.js
const { sequelize } = require('../models');

beforeAll(async () => {
  // Connect to test database or use in-memory database
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});
