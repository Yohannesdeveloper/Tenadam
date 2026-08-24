const fs = require('fs');
const path = require('path');
const postgres = require('postgres');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL env var is required');
  process.exit(1);
}

const sql = postgres(connectionString, {
  prepare: false,
  ssl: { rejectUnauthorized: false },
  connect_timeout: 15,
});

(async () => {
  try {
    const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await sql.unsafe(schemaSql);
    const tables = await sql`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    console.log('Schema applied. Tables now in database:');
    for (const t of tables) console.log(' -', t.table_name);
    await sql.end();
    process.exit(0);
  } catch (err) {
    console.error('Failed:', err.message);
    await sql.end().catch(() => {});
    process.exit(1);
  }
})();
