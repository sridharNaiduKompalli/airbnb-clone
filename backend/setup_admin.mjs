import pg from 'pg';
import bcrypt from 'bcrypt';
const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_sq6EWB9wbjlH@ep-jolly-rain-ay2pn7av-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: { rejectUnauthorized: false }
});

const adminEmail = 'admin@tropica.com';
const adminPassword = 'Admin@Tropica2026';
const adminName = 'Tropica Admin';

// Hash the password properly
const hash = await bcrypt.hash(adminPassword, 10);

// Upsert the admin user
const res = await pool.query(`
  INSERT INTO users (name, email, password_hash, role)
  VALUES ($1, $2, $3, 'admin')
  ON CONFLICT (email) DO UPDATE SET password_hash = $3, role = 'admin', name = $1
  RETURNING id, name, email, role
`, [adminName, adminEmail, hash]);

console.log('Admin user created/updated:');
console.log(res.rows[0]);
console.log('\nLogin credentials:');
console.log('  Email:    ' + adminEmail);
console.log('  Password: ' + adminPassword);

// Create favourites table if not exists
await pool.query(`
  CREATE TABLE IF NOT EXISTS favourites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, listing_id)
  )
`);
console.log('\nFavourites table created/verified.');

// Sync sequences
await pool.query(`SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 0) + 1, false)`);
await pool.query(`SELECT setval('listings_id_seq', COALESCE((SELECT MAX(id) FROM listings), 0) + 1, false)`);
console.log('Sequences synced.');

await pool.end();
console.log('\nDone!');
