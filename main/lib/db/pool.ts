import { Pool } from "pg";

// Singleton connection pool — reused across all API route invocations
// in the same server process (avoids creating a new connection on every request).
//
// DATABASE_URL should be the direct PostgreSQL connection string from your
// Supabase project: Settings → Database → Connection string → URI
// (use the "Direct connection" string, NOT the connection pooler one)
if (!process.env.DATABASE_URL) {
    throw new Error("Missing environment variable: DATABASE_URL");
}

export const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,                    // maximum number of clients in the pool
    idleTimeoutMillis: 30_000,  // close idle clients after 30s
    connectionTimeoutMillis: 5_000, // error if can't connect within 5s
});
