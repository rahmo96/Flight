process.env.NODE_ENV = 'test'; // מוודא שאנחנו במצב טסטים

const { sequelize } = require('../models');

beforeAll(async () => {
  console.log('🧪 Running in test mode');
  
  try {
    await sequelize.sync({ force: true });
    console.log('✅ Test database synced');
  } catch (error) {
    console.error('❌ Failed to sync test DB:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    await sequelize.close();
    console.log('🧹 Test database connection closed');
  } catch (error) {
    console.error('❌ Error closing test DB:', error);
  }
});
