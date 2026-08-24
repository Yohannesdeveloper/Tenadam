const postgres = require('postgres');

const sql = postgres(process.env.DATABASE_URL, {
  prepare: false,
  ssl: { rejectUnauthorized: false },
  connect_timeout: 20,
});

(async () => {
  try {
    const rows = await sql`
      SELECT id, email, name, left(password_hash, 7) AS hash_prefix,
             length(password_hash) AS hash_len, created_at
      FROM users ORDER BY created_at DESC LIMIT 5
    `;
    console.log('Users found:', rows.length);
    for (const r of rows) console.log(JSON.stringify(r));
    await sql.end();
  } catch (e) {
    console.error('DB error:', e.message);
    process.exit(1);
  }
})();
