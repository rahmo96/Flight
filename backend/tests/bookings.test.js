// backend/tests/bookings.test.js
const request = require('supertest');
const app = require('../server');
const { Booking, Flight } = require('../models');

describe('Booking API', () => {
  let testFlight;

  beforeEach(async () => {
    // Reset tables
    await Booking.destroy({ where: {} });
    await Flight.destroy({ where: {} });
    
    // Create test flight
    testFlight = await Flight.create({
      flight_number: 'TEST123',
      departure: 'New York',
      destination: 'London',
      departure_time: new Date('2023-12-01T10:00:00Z'),
      arrival_time: new Date('2023-12-01T22:00:00Z'),
      price: 299.99
    });
    
    // Create test booking
    await Booking.create({
      flight_number: testFlight.flight_number,
      passenger_name: 'Test User',
      passenger_email: 'test@example.com'
    });
  });

  it('should return all bookings', async () => {
    const res = await request(app).get('/api/bookings');
    expect(res.statusCode).toEqual(200);
    console.log('📦 BOOKINGS:', res.body); // הוסף זמנית!
    expect(res.body.length).toEqual(1);
    expect(res.body[0].passenger_name).toBe('Test User');
  });


  it('should create a new booking', async () => {
    const newBooking = {
      flight_number: testFlight.flight_number,
      passenger_name: 'Another User',
      passenger_email: 'another@example.com'
    };

    const res = await request(app)
      .post('/api/bookings')
      .send(newBooking);
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.passenger_name).toBe('Another User');
  });

  it('should get a booking by id', async () => {
    // First get all bookings to find an ID
    const allRes = await request(app).get('/api/bookings');
    const bookingId = allRes.body[0].id;
    
    const res = await request(app).get(`/api/bookings/${bookingId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.passenger_email).toBe('test@example.com');
  });

  it('should delete a booking', async () => {
    // First get all bookings to find an ID
    const allRes = await request(app).get('/api/bookings');
    const bookingId = allRes.body[0].id;
    
    const res = await request(app).delete(`/api/bookings/${bookingId}`);
    expect(res.statusCode).toEqual(204);
    
    // Verify it's gone
    const checkRes = await request(app).get(`/api/bookings/${bookingId}`);
    expect(checkRes.statusCode).toEqual(404);
  });
});
