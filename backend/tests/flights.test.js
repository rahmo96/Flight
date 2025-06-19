// backend/tests/flights.test.js
const request = require('supertest');
const app = require('../server');
const { Flight } = require('../models');

// Make app exportable in server.js first!

describe('Flight API', () => {
  beforeEach(async () => {
    // Reset flights table before each test
    await Flight.destroy({ where: {} });
    
    // Add test data
    await Flight.create({
      flight_number: 'TEST123',
      departure: 'New York',
      destination: 'London',
      departure_time: new Date('2023-12-01T10:00:00Z'),
      arrival_time: new Date('2023-12-01T22:00:00Z'),
      price: 299.99
    });
  });

  it('should return all flights', async () => {
    const res = await request(app).get('/api/flights');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].flight_number).toBe('TEST123');
  });

  it('should create a new flight', async () => {
    const newFlight = {
      flight_number: 'TEST456',
      departure: 'Paris',
      destination: 'Tokyo',
      departure_time: '2023-12-15T08:00:00Z',
      arrival_time: '2023-12-16T06:00:00Z',
      price: 599.99
    };

    const res = await request(app)
      .post('/api/flights')
      .send(newFlight);
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.flight_number).toBe('TEST456');
  });
});
