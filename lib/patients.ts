import "server-only";

import { getPool } from "@/lib/db";

export type PatientListItem = {
  id: string;
  numeroExpediente: string;
  nombreCompleto: string;
  telefono: string;
  email: string;
  contactoEmergencia: string;
  fechaNacimiento: string;
  activo: boolean;
};

export type PatientDetail = PatientListItem & {
  nombre: string;
  apellido1: string;
  apellido2: string;
  direccion: string;
  genero: string;
  contactoEmergenciaTelefono: string;
  citasRegistradas: number;
  expedientesRegistrados: number;
  facturasRegistradas: number;
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

export async function getPatientsList() {
  const pool = getPool();
  const result = await pool.query(
    `
      select
        id,
        numero_expediente,
        nombre,
        apellido_1,
        apellido_2,
        telefono,
        email,
        contacto_emergencia_nombre,
        fecha_nacimiento,
        activo
      from pacientes
      where activo = true
      order by numero_expediente asc
    `,
  );

  return result.rows.map<PatientListItem>((row) => ({
    id: String(row.id),
    numeroExpediente: String(row.numero_expediente),
    nombreCompleto: buildFullName(row),
    telefono: row.telefono ? String(row.telefono) : "-",
    email: row.email ? String(row.email) : "-",
    contactoEmergencia: row.contacto_emergencia_nombre
      ? String(row.contacto_emergencia_nombre)
      : "-",
    fechaNacimiento: formatDateValue(row.fecha_nacimiento),
    activo: Boolean(row.activo),
  }));
}

export async function getPatientDetail(patientId: string) {
  const pool = getPool();
  const result = await pool.query(
    `
      select
        p.id,
        p.numero_expediente,
        p.nombre,
        p.apellido_1,
        p.apellido_2,
        p.telefono,
        p.email,
        p.contacto_emergencia_nombre,
        p.contacto_emergencia_telefono,
        p.fecha_nacimiento,
        p.direccion,
        p.genero,
        p.activo,
        count(distinct c.id) as citas_registradas,
        count(distinct e.id) as expedientes_registrados,
        count(distinct f.id) as facturas_registradas
      from pacientes p
      left join citas c on c.paciente_id = p.id
      left join expedientes e on e.paciente_id = p.id
      left join facturas f on f.paciente_id = p.id
      where p.id = $1
      group by
        p.id,
        p.numero_expediente,
        p.nombre,
        p.apellido_1,
        p.apellido_2,
        p.telefono,
        p.email,
        p.contacto_emergencia_nombre,
        p.contacto_emergencia_telefono,
        p.fecha_nacimiento,
        p.direccion,
        p.genero
      limit 1
    `,
    [patientId],
  );

  const row = result.rows[0];

  if (!row) {
    return null;
  }

  return {
    id: String(row.id),
    numeroExpediente: String(row.numero_expediente),
    nombre: String(row.nombre),
    apellido1: String(row.apellido_1),
    apellido2: row.apellido_2 ? String(row.apellido_2) : "",
    nombreCompleto: buildFullName(row),
    telefono: row.telefono ? String(row.telefono) : "-",
    email: row.email ? String(row.email) : "-",
    contactoEmergencia: row.contacto_emergencia_nombre
      ? String(row.contacto_emergencia_nombre)
      : "-",
    contactoEmergenciaTelefono: row.contacto_emergencia_telefono
      ? String(row.contacto_emergencia_telefono)
      : "-",
    fechaNacimiento: formatDateValue(row.fecha_nacimiento),
    direccion: row.direccion ? String(row.direccion) : "-",
    genero: row.genero ? String(row.genero) : "-",
    activo: Boolean(row.activo),
    citasRegistradas: Number(row.citas_registradas ?? 0),
    expedientesRegistrados: Number(row.expedientes_registrados ?? 0),
    facturasRegistradas: Number(row.facturas_registradas ?? 0),
  } satisfies PatientDetail;
}
