import postgres from "postgres";

const connectionString = process.env.DATABASE_URL || "";

const isLocalConnection =
  !connectionString ||
  /@(localhost|127\.0\.0\.1|\[::1\])[:/]/.test(connectionString) ||
  /\.railway\.internal[:/]/.test(connectionString);

export const isDbConfigured = Boolean(
  connectionString && !connectionString.includes("your-database-url-here")
);

if (!isDbConfigured && typeof window === "undefined") {
  console.warn(
    "DATABASE_URL environment variable is not configured. Database features will be unavailable."
  );
}

const globalForDb = globalThis as unknown as { sql?: postgres.Sql };

export const sql: postgres.Sql =
  globalForDb.sql ??
  postgres(isDbConfigured ? connectionString : "postgres://localhost:5432/postgres", {
    prepare: false,
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: isDbConfigured && !isLocalConnection ? { rejectUnauthorized: false } : false,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.sql = sql;
}
