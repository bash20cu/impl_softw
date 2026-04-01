import "server-only";

import { Pool } from "pg";

declare global {
  var clinicaplusPool: Pool | undefined;
}

function getConnectionString() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL no esta definida. Configura .env.local antes de usar la base de datos.",
    );
  }

  return connectionString;
}

export function getPool() {
  if (!globalThis.clinicaplusPool) {
    globalThis.clinicaplusPool = new Pool({
      connectionString: getConnectionString(),
    });
  }

  return globalThis.clinicaplusPool;
}

export async function healthcheckDatabase() {
  const pool = getPool();
  const result = await pool.query("select now() as current_time");
  return result.rows[0];
}
