import "server-only";

import { getPool } from "@/lib/db";

export type DoctorListItem = {
  id: string;
  codigoColegiado: string;
  nombreCompleto: string;
  email: string;
  telefono: string;
  especialidad: string;
  fechaContratacion: string;
  activo: boolean;
};

export type DoctorDetail = DoctorListItem & {
  usuarioId: string;
  especialidadId: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  citasRegistradas: number;
  expedientesRegistrados: number;
};

export type DoctorFormOption = {
  id: string;
  label: string;
  helper?: string;
};

function formatDateValue(value: Date | string | null) {
  if (!value) {
    return "-";
  }

  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  return value.toISOString().slice(0, 10);
}

function buildFullName(row: {
  nombre: string;
  apellido_1: string;
  apellido_2: string | null;
}) {
  return [row.nombre, row.apellido_1, row.apellido_2].filter(Boolean).join(" ");
}

export async function getDoctorsList() {
  const pool = getPool();
  const result = await pool.query(
    `
      select
        d.id,
        d.codigo_colegiado,
        d.fecha_contratacion,
        e.nombre as especialidad,
        u.nombre,
        u.apellido_1,
        u.apellido_2,
        u.email,
        u.telefono,
        u.activo
      from doctores d
      join usuarios u on u.id = d.usuario_id
      join especialidades e on e.id = d.especialidad_id
      where u.activo = true
      order by d.codigo_colegiado asc
    `,
  );

  return result.rows.map<DoctorListItem>((row) => ({
    id: String(row.id),
    codigoColegiado: String(row.codigo_colegiado),
    nombreCompleto: buildFullName(row),
    email: String(row.email),
    telefono: row.telefono ? String(row.telefono) : "-",
    especialidad: String(row.especialidad),
    fechaContratacion: formatDateValue(row.fecha_contratacion),
    activo: Boolean(row.activo),
  }));
}

export async function getDoctorDetail(doctorId: string) {
  const pool = getPool();
  const result = await pool.query(
    `
      select
        d.id,
        d.usuario_id,
        d.especialidad_id,
        d.codigo_colegiado,
        d.fecha_contratacion,
        e.nombre as especialidad,
        u.nombre,
        u.apellido_1,
        u.apellido_2,
        u.email,
        u.telefono,
        u.activo,
        count(distinct c.id) as citas_registradas,
        count(distinct ex.id) as expedientes_registrados
      from doctores d
      join usuarios u on u.id = d.usuario_id
      join especialidades e on e.id = d.especialidad_id
      left join citas c on c.doctor_id = d.id
      left join expedientes ex on ex.doctor_id = d.id
      where d.id = $1
      group by
        d.id,
        d.usuario_id,
        d.especialidad_id,
        d.codigo_colegiado,
        d.fecha_contratacion,
        e.nombre,
        u.nombre,
        u.apellido_1,
        u.apellido_2,
        u.email,
        u.telefono,
        u.activo
      limit 1
    `,
    [doctorId],
  );

  const row = result.rows[0];

  if (!row) {
    return null;
  }

  return {
    id: String(row.id),
    usuarioId: String(row.usuario_id),
    especialidadId: String(row.especialidad_id),
    codigoColegiado: String(row.codigo_colegiado),
    nombre: String(row.nombre),
    apellido1: String(row.apellido_1),
    apellido2: row.apellido_2 ? String(row.apellido_2) : "",
    nombreCompleto: buildFullName(row),
    email: String(row.email),
    telefono: row.telefono ? String(row.telefono) : "-",
    especialidad: String(row.especialidad),
    fechaContratacion: formatDateValue(row.fecha_contratacion),
    activo: Boolean(row.activo),
    citasRegistradas: Number(row.citas_registradas ?? 0),
    expedientesRegistrados: Number(row.expedientes_registrados ?? 0),
  } satisfies DoctorDetail;
}

export async function getDoctorFormOptions() {
  const pool = getPool();
  const result = await pool.query(
    `
      select id, nombre, descripcion
      from especialidades
      order by nombre asc
    `,
  );

  return result.rows.map<DoctorFormOption>((row) => ({
    id: String(row.id),
    label: String(row.nombre),
    helper: row.descripcion ? String(row.descripcion) : undefined,
  }));
}
