import "server-only";

import { getPool } from "@/lib/db";

export type CatalogItem = {
  id: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
};

export type MedicineItem = CatalogItem & {
  presentacion: string;
};

export type OfficeItem = {
  id: string;
  nombre: string;
  ubicacion: string;
  piso: string;
  estado: string;
};

export async function getSpecialties() {
  const pool = getPool();
  const result = await pool.query(
    `
      select id, nombre, descripcion, activo
      from especialidades
      where activo = true
      order by nombre asc
    `,
  );

  return result.rows.map<CatalogItem>((row) => ({
    id: String(row.id),
    nombre: String(row.nombre),
    descripcion: row.descripcion ? String(row.descripcion) : "",
    activo: Boolean(row.activo),
  }));
}

export async function getSpecialtyById(id: string) {
  const pool = getPool();
  const result = await pool.query(
    `
      select id, nombre, descripcion, activo
      from especialidades
      where id = $1
      limit 1
    `,
    [id],
  );

  const row = result.rows[0];
  return row
    ? {
        id: String(row.id),
        nombre: String(row.nombre),
        descripcion: row.descripcion ? String(row.descripcion) : "",
        activo: Boolean(row.activo),
      } satisfies CatalogItem
    : null;
}

export async function getMedicines() {
  const pool = getPool();
  const result = await pool.query(
    `
      select id, nombre, presentacion, descripcion, activo
      from medicamentos
      where activo = true
      order by nombre asc
    `,
  );

  return result.rows.map<MedicineItem>((row) => ({
    id: String(row.id),
    nombre: String(row.nombre),
    presentacion: row.presentacion ? String(row.presentacion) : "",
    descripcion: row.descripcion ? String(row.descripcion) : "",
    activo: Boolean(row.activo),
  }));
}

export async function getMedicineById(id: string) {
  const pool = getPool();
  const result = await pool.query(
    `
      select id, nombre, presentacion, descripcion, activo
      from medicamentos
      where id = $1
      limit 1
    `,
    [id],
  );

  const row = result.rows[0];
  return row
    ? {
        id: String(row.id),
        nombre: String(row.nombre),
        presentacion: row.presentacion ? String(row.presentacion) : "",
        descripcion: row.descripcion ? String(row.descripcion) : "",
        activo: Boolean(row.activo),
      } satisfies MedicineItem
    : null;
}

export async function getOffices() {
  const pool = getPool();
  const result = await pool.query(
    `
      select id, nombre, ubicacion, piso, estado
      from consultorios
      order by nombre asc
    `,
  );

  return result.rows.map<OfficeItem>((row) => ({
    id: String(row.id),
    nombre: String(row.nombre),
    ubicacion: row.ubicacion ? String(row.ubicacion) : "",
    piso: row.piso ? String(row.piso) : "",
    estado: String(row.estado),
  }));
}

export async function getOfficeById(id: string) {
  const pool = getPool();
  const result = await pool.query(
    `
      select id, nombre, ubicacion, piso, estado
      from consultorios
      where id = $1
      limit 1
    `,
    [id],
  );

  const row = result.rows[0];
  return row
    ? {
        id: String(row.id),
        nombre: String(row.nombre),
        ubicacion: row.ubicacion ? String(row.ubicacion) : "",
        piso: row.piso ? String(row.piso) : "",
        estado: String(row.estado),
      } satisfies OfficeItem
    : null;
}
