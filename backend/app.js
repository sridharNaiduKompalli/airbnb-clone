import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getListings, getListingById, createBooking, getBookings, initializeDatabase } from './db.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Request logger for DevOps observability
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Initialize database connection
initializeDatabase();

// Health Check Endpoint (Critical for Docker & Kubernetes & Frontend local proxy)
const healthHandler = async (req, res) => {
  const dbStatus = process.env.DATABASE_URL ? "connected (PostgreSQL)" : "fallback (In-Memory)";
  res.status(200).json({
    status: "UP",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus,
    environment: process.env.NODE_ENV || "development"
  });
};
app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// API Routes
app.get('/api/listings', async (req, res) => {
  try {
    const { type } = req.query;
    const listings = await getListings(type);
    res.json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

app.get('/api/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await getListingById(id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json(listing);
  } catch (error) {
    console.error(`Error fetching listing ${id}:`, error);
    res.status(500).json({ error: "Failed to fetch listing details" });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await getBookings();
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const { listing_id, check_in, check_out, guest_name, total_price } = req.body;
    
    // Simple Validation
    if (!listing_id || !check_in || !check_out || !guest_name || !total_price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const booking = await createBooking({
      listing_id,
      check_in,
      check_out,
      guest_name,
      total_price
    });
    
    res.status(201).json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
