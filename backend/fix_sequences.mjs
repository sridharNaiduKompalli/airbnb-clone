import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_sq6EWB9wbjlH@ep-jolly-rain-ay2pn7av-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: { rejectUnauthorized: false }
});

// Fix the sequence on listings and bookings
const maxListings = await pool.query('SELECT MAX(id) FROM listings');
const maxBookings = await pool.query('SELECT MAX(id) FROM bookings');
const maxUsers = await pool.query('SELECT MAX(id) FROM users');

const maxL = maxListings.rows[0].max || 0;
const maxB = maxBookings.rows[0].max || 0;
const maxU = maxUsers.rows[0].max || 0;

console.log(`Max listing id: ${maxL}, Max booking id: ${maxB}, Max user id: ${maxU}`);

await pool.query(`SELECT setval('listings_id_seq', ${maxL + 1}, false)`);
await pool.query(`SELECT setval('bookings_id_seq', ${maxB + 1}, false)`);
await pool.query(`SELECT setval('users_id_seq', ${maxU + 1}, false)`);

console.log('Sequences reset successfully!');

// Verify by doing a test insert
const imageUrl = 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2';
const imagesArray = [imageUrl, imageUrl, imageUrl, imageUrl, imageUrl];
try {
  const res = await pool.query(
    `INSERT INTO listings (title, description, price, location, image, images, rating, reviews_count, type, host_name, host_avatar, amenities, host_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id, title`,
    ['Sequence Test Villa', 'desc', 100, 'Test', imageUrl, imagesArray, 5.0, 0, 'cabins', 'Host', 'https://avatar.url', ['Wifi'], 1]
  );
  console.log('Test insert successful! id=' + res.rows[0].id);
  await pool.query('DELETE FROM listings WHERE id = $1', [res.rows[0].id]);
  console.log('Test row cleaned up.');
} catch(e) {
  console.error('Test insert still failed:', e.message);
}

await pool.end();
