import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getListings, getListingById, createBooking, getBookings, initializeDatabase, getUserByEmail, createUser, createListing, getDashboardStats } from './db.js';

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

// Initialize DB on startup
initializeDatabase();

const JWT_SECRET = process.env.JWT_SECRET || 'tropica_super_secret_key_2026';

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// --- AUTHENTICATION ROUTES ---
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const password_hash = await bcrypt.hash(password, 10);
    const user = await createUser({ name, email, password_hash });
    
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const user = await getUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

// --- ADMIN ROUTES ---
app.get('/api/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// --- LISTING ROUTES ---
app.post('/api/listings', authenticateToken, async (req, res) => {
  try {
    const listing = await createListing(req.body, req.user.id, req.user.name);
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

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
