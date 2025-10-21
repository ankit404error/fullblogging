import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./drizzle/schema";

console.log("DATABASE_URL:", process.env.DATABASE_URL);

let pool;
try {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
} catch (error) {
  console.error("Error creating database pool:", error);
  throw error;
}
export const db = drizzle(pool, { schema });
