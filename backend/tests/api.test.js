import request from 'supertest';
import app from '../app.js';

describe('Airbnb Clone Backend API Tests', () => {
  // Test Health Endpoint
  describe('GET /health', () => {
    it('should return 200 OK and status UP', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('status', 'UP');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('database');
    });
  });

  // Test Listings Endpoints
  describe('GET /api/listings', () => {
    it('should return all mock listings', async () => {
      const response = await request(app)
        .get('/api/listings')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('price');
    });

    it('should filter listings by type', async () => {
      const response = await request(app)
        .get('/api/listings?type=cabins')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // All returned listings should have the type 'cabins'
      response.body.forEach(listing => {
        expect(listing.type).toBe('cabins');
      });
    });
  });

  describe('GET /api/listings/:id', () => {
    it('should return a specific listing by id', async () => {
      const response = await request(app)
        .get('/api/listings/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('title', 'A-Frame Forest Cabin');
    });

    it('should return 404 for an invalid listing id', async () => {
      const response = await request(app)
        .get('/api/listings/999')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Listing not found');
    });
  });

  // Test Bookings Endpoints
  describe('POST /api/bookings and GET /api/bookings', () => {
    it('should reject a booking with missing parameters', async () => {
      const response = await request(app)
        .post('/api/bookings')
        .send({
          listing_id: 1,
          guest_name: 'John Doe'
          // missing dates and price
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Missing required fields');
    });

    it('should successfully create a booking and retrieve it', async () => {
      const bookingData = {
        listing_id: 1,
        check_in: '2026-09-01',
        check_out: '2026-09-05',
        guest_name: 'Jane Doe',
        total_price: 600
      };

      // Create Booking
      const postResponse = await request(app)
        .post('/api/bookings')
        .send(bookingData)
        .expect(201);

      expect(postResponse.body).toHaveProperty('id');
      expect(postResponse.body.guest_name).toBe(bookingData.guest_name);
      expect(postResponse.body.total_price).toBe(bookingData.total_price);

      // Get Bookings list
      const getResponse = await request(app)
        .get('/api/bookings')
        .expect(200);

      expect(Array.isArray(getResponse.body)).toBe(true);
      expect(getResponse.body.length).toBeGreaterThan(0);
      
      const foundBooking = getResponse.body.find(b => b.guest_name === bookingData.guest_name);
      expect(foundBooking).toBeDefined();
      expect(foundBooking.listing_title).toBe('A-Frame Forest Cabin');
    });
  });
});
