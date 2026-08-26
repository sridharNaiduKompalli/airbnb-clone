import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Pre-populated mock listing data for zero-config fallback
const mockListings = [
  {
    id: 1,
    title: "A-Frame Forest Cabin",
    description: "Nestled deep in the pine woods, this cozy A-frame cabin offers the perfect off-grid escape with modern amenities including a wood-fired hot tub, outdoor fire pit, and floor-to-ceiling windows for stargazing.",
    price: 150,
    location: "Cascade Mountains, Washington",
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=600"
    ],
    rating: 4.92,
    reviews_count: 124,
    type: "cabins",
    host_name: "Sarah & Mark",
    host_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    amenities: ["Hot Tub", "Fire Pit", "Wifi", "Kitchen", "Mountain View"]
  },
  {
    id: 2,
    title: "Minimalist Beachfront Villa",
    description: "Wake up to the sound of waves. This stunning modernist villa features private beach access, infinity pool, open-concept living, and breathtaking panoramic ocean views from every room.",
    price: 320,
    location: "Malibu, California",
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1473116763269-255ea76e7acb?auto=format&fit=crop&q=80&w=600"
    ],
    rating: 4.88,
    reviews_count: 85,
    type: "beachfront",
    host_name: "Elena",
    host_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    amenities: ["Infinity Pool", "Beach Access", "AC", "Gym", "Ocean View"]
  },
  {
    id: 3,
    title: "Redwood Treehouse Canopy",
    description: "Suspended 30 feet above the forest floor, this luxury treehouse is connected by suspension bridges. Experience the redwood canopy in style with a hot tub, wrap-around deck, and outdoor shower.",
    price: 240,
    location: "Santa Cruz, California",
    image: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600"
    ],
    rating: 4.97,
    reviews_count: 210,
    type: "treehouses",
    host_name: "Dustin",
    host_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    amenities: ["Suspension Bridge", "Hot Tub", "Espresso Machine", "Wifi", "Forest View"]
  },
  {
    id: 4,
    title: "Desert Dome Oasis",
    description: "A geodesic dome situated on 5 acres of private desert. Experience surreal sunsets and stargazing. Includes heated plunge pool, stargazing deck, and modern bohemian interior design.",
    price: 180,
    location: "Joshua Tree, California",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1472214222541-d510753a4707?auto=format&fit=crop&q=80&w=600"
    ],
    rating: 4.75,
    reviews_count: 94,
    type: "desert",
    host_name: "Ronnie",
    host_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    amenities: ["Plunge Pool", "Boho Decor", "AC", "Fire Pit", "Stargazing Deck"]
  },
  {
    id: 5,
    title: "Historic Italian Countryside Stone House",
    description: "Enjoy Italian living in this beautifully restored 16th-century stone house nestled among olive groves. Experience private olive oil tastings and relax under the pergola.",
    price: 110,
    location: "Tuscany, Italy",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?auto=format&fit=crop&q=80&w=600"
    ],
    rating: 4.91,
    reviews_count: 142,
    type: "historic",
    host_name: "Giovanni",
    host_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
    amenities: ["Olive Grove", "Pergola", "Kitchen", "Fireplace", "Vineyard View"]
  },
  {
    id: 6,
    title: "Modern Glass Lakehouse",
    description: "Stunning floor-to-ceiling glass walls look out over a peaceful lake. Features private dock, kayaks, paddleboards, and a modern sauna for ultimate relaxation.",
    price: 260,
    location: "Lake Placid, New York",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&q=80&w=600"
    ],
    rating: 4.85,
    reviews_count: 67,
    type: "lake",
    host_name: "Amanda",
    host_avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    amenities: ["Private Dock", "Sauna", "Kayaks", "Wifi", "Lake View"]
  },
  {
    id: 7,
    title: "Riverfront Glass A-Frame",
    description: "Perched right above the running river, this modern glass A-frame boasts wrapping decks, modern kitchen, fireplace, and hot tub. Listen to the gentle rapids as you fall asleep.",
    price: 180,
    location: "Blue Ridge, Georgia",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=600"
    ],
    rating: 4.95,
    reviews_count: 98,
    type: "cabins",
    host_name: "Deborah",
    host_avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    amenities: ["River View", "Hot Tub", "Fire Pit", "Wifi", "Coffee Bar"]
  },
  {
    id: 8,
    title: "Ocean-Side Modernist Studio",
    description: "A gorgeous oceanfront studio suite just steps from the sand. Relax on your private balcony, take in sunset views, or splash in the shared beachfront pool.",
    price: 210,
    location: "Miami Beach, Florida",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1473116763269-255ea76e7acb?auto=format&fit=crop&q=80&w=600"
    ],
    rating: 4.81,
    reviews_count: 54,
    type: "beachfront",
    host_name: "Carlos",
    host_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    amenities: ["Beach View", "Balcony", "AC", "Wifi", "Pool Access"]
  },
  {
    id: 9,
    title: "Bamboo Forest Eco Treehouse",
    description: "An eco-friendly bamboo villa hanging high in the canopy of a tropical forest. It features an open-air plunge tub, hammock nets, and organic breakfast served daily.",
    price: 130,
    location: "Ubud, Bali",
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600"
    ],
    rating: 4.94,
    reviews_count: 320,
    type: "treehouses",
    host_name: "Ketut",
    host_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    amenities: ["Outdoor Bath", "Hammock", "Breakfast Included", "Forest Views", "Eco-friendly"]
  },
  {
    id: 10,
    title: "Stargazing Desert Container Home",
    description: "Experience the remote beauty of the red rocks. This custom-built shipping container home includes an expansive rooftop deck designed specifically for night-sky viewing.",
    price: 195,
    location: "Moab, Utah",
    image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1472214222541-d510753a4707?auto=format&fit=crop&q=80&w=600"
    ],
    rating: 4.87,
    reviews_count: 72,
    type: "desert",
    host_name: "Wyatt",
    host_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    amenities: ["Stargazing Deck", "AC", "Fire Pit", "Wifi", "Kitchen"]
  },
  {
    id: 11,
    title: "18th-Century Chateau Royal Suite",
    description: "Live like French royalty. This grand suite features soaring ceilings, antiques, a private library, and access to 10 acres of immaculate manor gardens.",
    price: 280,
    location: "Loire Valley, France",
    image: "https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?auto=format&fit=crop&q=80&w=600"
    ],
    rating: 4.96,
    reviews_count: 110,
    type: "historic",
    host_name: "Jean-Pierre",
    host_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
    amenities: ["Manor Gardens", "Breakfast Served", "Fireplace", "Library Access", "Wifi"]
  },
  {
    id: 12,
    title: "Cozy Lakefront Cedar Cabin",
    description: "Walk out directly to your private sandy beach on the lake. Enjoy lakeside views, a wood-fired sauna, kayaks, and a wrap-around cedar deck with a grill.",
    price: 290,
    location: "Lake Tahoe, California",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&q=80&w=600"
    ],
    rating: 4.89,
    reviews_count: 180,
    type: "lake",
    host_name: "Laura",
    host_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    amenities: ["Private Beach", "Sauna", "Kayaks", "Deck Grill", "Wifi"]
  }
];

const mockBookings = [];

let pool = null;
let isPostgres = false;

if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
    });
    isPostgres = true;
    console.log("Database connector initialized with PostgreSQL.");
  } catch (error) {
    console.error("Failed to initialize PostgreSQL pool, falling back to mock database.", error);
    isPostgres = false;
  }
} else {
  console.log("DATABASE_URL is not set. Using in-memory fallback database.");
}

// Function to initialize tables in PostgreSQL
export async function initializeDatabase() {
  if (!isPostgres) return;

  const client = await pool.connect();
  try {
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create listings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS listings (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price INTEGER NOT NULL,
        location VARCHAR(255) NOT NULL,
        image TEXT NOT NULL,
        images TEXT[] NOT NULL,
        rating NUMERIC(3, 2) NOT NULL DEFAULT 5.0,
        reviews_count INTEGER NOT NULL DEFAULT 0,
        type VARCHAR(50) NOT NULL,
        host_name VARCHAR(100) NOT NULL,
        host_avatar TEXT NOT NULL,
        amenities TEXT[] NOT NULL,
        host_id INTEGER REFERENCES users(id) ON DELETE SET NULL
      );
    `);

    // Create bookings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        check_in VARCHAR(50) NOT NULL,
        check_out VARCHAR(50) NOT NULL,
        guest_name VARCHAR(100) NOT NULL,
        total_price INTEGER NOT NULL,
        payment_status VARCHAR(50) DEFAULT 'completed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Upgrade existing tables if they were created before
    await client.query(`ALTER TABLE listings ADD COLUMN IF NOT EXISTS host_id INTEGER REFERENCES users(id) ON DELETE SET NULL;`).catch(() => {});
    await client.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;`).catch(() => {});
    await client.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'completed';`).catch(() => {});

    // Seed mock data if listings table is empty
    const checkListings = await client.query('SELECT COUNT(*) FROM listings');
    if (parseInt(checkListings.rows[0].count) === 0) {
      console.log("Seeding initial mock listings to PostgreSQL...");
      // Add default admin user
      const adminInsert = await client.query(
        `INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email RETURNING id`,
        ['Admin User', 'admin@tropica.com', '$2b$10$C8.1zM.1T1/aG0.1H1.1/.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1', 'admin'] // Fake hash for mock, they should register
      );
      const adminId = adminInsert.rows[0].id;

      for (const item of mockListings) {
        await client.query(
          `INSERT INTO listings (id, title, description, price, location, image, images, rating, reviews_count, type, host_name, host_avatar, amenities, host_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
          [item.id, item.title, item.description, item.price, item.location, item.image, item.images || [item.image], item.rating, item.reviews_count, item.type, item.host_name, item.host_avatar, item.amenities, adminId]
        );
      }
      console.log("Mock listings seeded successfully.");
    }
  } catch (error) {
    console.error("Database initialization failed:", error);
  } finally {
    client.release();
  }
}

// CRUD Wrappers
export async function getListings(typeFilter) {
  if (isPostgres) {
    try {
      if (typeFilter) {
        const res = await pool.query('SELECT * FROM listings WHERE type = $1', [typeFilter]);
        return res.rows;
      }
      const res = await pool.query('SELECT * FROM listings ORDER BY id ASC');
      return res.rows;
    } catch (error) {
      console.error("Postgres error, using mock data:", error);
    }
  }

  // Fallback
  if (typeFilter) {
    return mockListings.filter(l => l.type === typeFilter);
  }
  return mockListings;
}

export async function getListingById(id) {
  const numId = parseInt(id);
  if (isPostgres) {
    try {
      const res = await pool.query('SELECT * FROM listings WHERE id = $1', [numId]);
      return res.rows[0] || null;
    } catch (error) {
      console.error("Postgres error, using mock data:", error);
    }
  }

  // Fallback
  return mockListings.find(l => l.id === numId) || null;
}

export async function createBooking(booking) {
  const { listing_id, check_in, check_out, guest_name, total_price } = booking;
  const numListingId = parseInt(listing_id);

  if (isPostgres) {
    try {
      const res = await pool.query(
        `INSERT INTO bookings (listing_id, check_in, check_out, guest_name, total_price)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [numListingId, check_in, check_out, guest_name, total_price]
      );
      return res.rows[0];
    } catch (error) {
      console.error("Postgres error, using mock data:", error);
    }
  }

  // Fallback
  const newBooking = {
    id: mockBookings.length + 1,
    listing_id: numListingId,
    check_in,
    check_out,
    guest_name,
    total_price,
    created_at: new Date().toISOString()
  };
  mockBookings.push(newBooking);
  return newBooking;
}

export async function getBookings() {
  if (isPostgres) {
    try {
      const res = await pool.query(`
        SELECT b.*, l.title as listing_title, l.image as listing_image, l.location as listing_location
        FROM bookings b
        JOIN listings l ON b.listing_id = l.id
        ORDER BY b.id DESC
      `);
      return res.rows;
    } catch (error) {
      console.error("Postgres error, using mock data:", error);
    }
  }

  // Fallback
  return mockBookings.map(b => {
    const listing = mockListings.find(l => l.id === b.listing_id) || {};
    return {
      ...b,
      listing_title: listing.title || "Unknown Listing",
      listing_image: listing.image || "",
      listing_location: listing.location || "Unknown Location"
    };
  });
}

// Auth wrappers
export async function getUserByEmail(email) {
  if (isPostgres) {
    try {
      const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      return res.rows[0] || null;
    } catch (error) {
      console.error(error);
    }
  }
  return null;
}

export async function createUser(user) {
  if (isPostgres) {
    try {
      const res = await pool.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role',
        [user.name, user.email, user.password_hash]
      );
      return res.rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  return null;
}

// Host wrappers
export async function createListing(listing, hostId, hostName) {
  if (isPostgres) {
    try {
      // Support both images[] array and single image URL
      const imageUrl = listing.image || (listing.images && listing.images[0]) || '';
      const imagesArray = listing.images && listing.images.length > 0
        ? listing.images
        : [imageUrl, imageUrl, imageUrl, imageUrl, imageUrl];

      const res = await pool.query(
        `INSERT INTO listings (title, description, price, location, image, images, rating, reviews_count, type, host_name, host_avatar, amenities, host_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
        [
          listing.title, listing.description, Number(listing.price), listing.location,
          imageUrl, imagesArray, 5.0, 0, listing.type || 'cabins',
          hostName, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150',
          listing.amenities || ['Wifi'], hostId
        ]
      );
      return res.rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  return null;
}

export async function getDashboardStats() {
  if (isPostgres) {
    try {
      const users = await pool.query('SELECT COUNT(*) FROM users');
      const listings = await pool.query('SELECT COUNT(*) FROM listings');
      const bookings = await pool.query('SELECT COUNT(*) as count, SUM(total_price) as revenue FROM bookings');
      
      return {
        users: parseInt(users.rows[0].count),
        listings: parseInt(listings.rows[0].count),
        bookings: parseInt(bookings.rows[0].count),
        revenue: parseInt(bookings.rows[0].revenue || 0)
      };
    } catch (error) {
      console.error(error);
    }
  }
  return { users: 0, listings: 0, bookings: 0, revenue: 0 };
}

// Export raw pool for tests or custom operations
export { pool, isPostgres };
