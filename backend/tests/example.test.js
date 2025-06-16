const request = require('supertest');
const app = require('../server');

describe('GET /api/flights', () => {
  it('should return all flights', async () => {
    const res = await request(app).get('/api/flights');
    expect(res.statusCode).toEqual(200);
  });
});
