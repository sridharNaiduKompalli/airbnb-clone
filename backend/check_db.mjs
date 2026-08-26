import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_sq6EWB9wbjlH@ep-jolly-rain-ay2pn7av-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: { rejectUnauthorized: false }
});

const cols = await pool.query(`
  SELECT column_name, data_type, is_nullable
  FROM information_schema.columns
  WHERE table_name='listings'
  ORDER BY ordinal_position
`);
console.log('LISTINGS TABLE SCHEMA:');
cols.rows.forEach(r => console.log(` ${r.column_name}: ${r.data_type} (nullable: ${r.is_nullable})`));

// Try inserting a test row
try {
  const imageUrl = 'https://images.unsplash.com/photo-test';
  const imagesArray = [imageUrl, imageUrl, imageUrl, imageUrl, imageUrl];
  const res = await pool.query(
    `INSERT INTO listings (title, description, price, location, image, images, rating, reviews_count, type, host_name, host_avatar, amenities, host_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
    ['Direct DB Test', 'desc', 100, 'location', imageUrl, imagesArray, 5.0, 0, 'cabins', 'Host', 'https://avatar.url', ['Wifi'], 1]
  );
  console.log('\nDIRECT INSERT: success, id=' + res.rows[0].id);
  // Clean up
  await pool.query('DELETE FROM listings WHERE id = $1', [res.rows[0].id]);
  console.log('Cleanup done.');
} catch (err) {
  console.error('\nDIRECT INSERT FAILED:', err.message, err.detail || '');
}

await pool.end();
