const postgres = require('postgres');
const bcrypt = require('bcryptjs');

const email = (process.env.TEST_EMAIL || '').toLowerCase();
const password = process.env.TEST_PW || '';

const sql = postgres(process.env.DATABASE_URL, {
  prepare: false,
  ssl: { rejectUnauthorized: false },
  connect_timeout: 20,
});

(async () => {
  try {
    const rows = await sql`
      SELECT password_hash FROM users
      WHERE lower(email) = ${email} LIMIT 1
    `;
    if (rows.length === 0) {
      console.log('No user found for', email);
    } else {
      const ok = await bcrypt.compare(password, rows[0].password_hash);
      console.log('Password matches:', ok);
    }
    await sql.end();
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
})();
