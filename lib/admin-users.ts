import "server-only";

import { getPool } from "@/lib/db";

export type AdminUserListItem = {
  id: string;
  nombreCompleto: string;
  email: string;
  telefono: string;
  rol: string;
  activo: boolean;
};

export type AdminUserDetail = AdminUserListItem & {
  nombre: string;
  apellido1: string;
  apellido2: string;
};

export type RoleOption = {
  id: string;
  nombre: string;
};

function buildFullName(row: {
  nombre: string;
  apellido_1: string;
  apellido_2: string | null;
}) {
  return [row.nombre, row.apellido_1, row.apellido_2].filter(Boolean).join(" ");
}

export async function getAdminUsersList() {
  const pool = getPool();
  const result = await pool.query(
    `
      select
        u.id,
        u.nombre,
        u.apellido_1,
        u.apellido_2,
        u.email,
        u.telefono,
        u.activo,
        r.nombre as rol
      from usuarios u
      join roles r on r.id = u.rol_id
      order by u.created_at asc, u.nombre asc
    `,
  );

  return result.rows.map<AdminUserListItem>((row) => ({
    id: String(row.id),
    nombreCompleto: buildFullName(row),
    email: String(row.email),
    telefono: row.telefono ? String(row.telefono) : "-",
    rol: String(row.rol),
    activo: Boolean(row.activo),
  }));
}

export async function getAdminUserById(userId: string) {
  const pool = getPool();
  const result = await pool.query(
    `
      select
        u.id,
        u.nombre,
        u.apellido_1,
        u.apellido_2,
        u.email,
        u.telefono,
        u.activo,
        r.nombre as rol
      from usuarios u
      join roles r on r.id = u.rol_id
      where u.id = $1
      limit 1
    `,
    [userId],
  );

  const row = result.rows[0];

  if (!row) {
    return null;
  }

  return {
    id: String(row.id),
    nombre: String(row.nombre),
    apellido1: String(row.apellido_1),
    apellido2: row.apellido_2 ? String(row.apellido_2) : "",
    nombreCompleto: buildFullName(row),
    email: String(row.email),
    telefono: row.telefono ? String(row.telefono) : "",
    rol: String(row.rol),
    activo: Boolean(row.activo),
  } satisfies AdminUserDetail;
}

export async function getRoleOptions() {
  const pool = getPool();
  const result = await pool.query(
    `
      select id, nombre
      from roles
      order by nombre asc
    `,
  );

  return result.rows.map<RoleOption>((row) => ({
    id: String(row.id),
    nombre: String(row.nombre),
  }));
}
