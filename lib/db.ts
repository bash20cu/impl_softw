import "server-only";

import { Pool } from "pg";

export type AuthUserRow = {
  id: string;
  email: string;
  password_hash: string;
  nombre: string;
  apellido_1: string;
  apellido_2: string | null;
  activo: boolean;
  rol_nombre: string;
};

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

export async function findUserForAuth(email: string) {
  const pool = getPool();
  const result = await pool.query<AuthUserRow>(
    `
      select
        u.id,
        u.email,
        u.password_hash,
        u.nombre,
        u.apellido_1,
        u.apellido_2,
        u.activo,
        r.nombre as rol_nombre
      from usuarios u
      join roles r on r.id = u.rol_id
      where lower(u.email) = lower($1)
      limit 1
    `,
    [email],
  );

  return result.rows[0] ?? null;
}
