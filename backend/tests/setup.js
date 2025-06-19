// backend/tests/setup.js
const { sequelize } = require('../models');

// Global setup
beforeAll(async () => {
  // Make sure we're using a test database
  console.log('Test database URL:', process.env.DATABASE_URL);
  
  // Sync all models with force: true to create fresh tables
  await sequelize.sync({ force: true });
});

// Global teardown
afterAll(async () => {
  await sequelize.close();
});
