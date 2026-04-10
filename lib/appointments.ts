import "server-only";

import { getPool } from "@/lib/db";

type AppointmentRowBase = {
  id: string;
  paciente_id: string;
  doctor_id: string;
  consultorio_id: string | null;
  fecha: Date | string;
  hora_inicio: string;
  hora_fin: string;
  estado: string;
  motivo: string | null;
  observaciones: string | null;
  paciente_expediente: string;
  paciente_nombre: string;
  doctor_codigo: string;
  doctor_nombre: string;
  consultorio_nombre: string | null;
};

export type AppointmentListItem = {
  id: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: string;
  paciente: string;
  pacienteExpediente: string;
  doctor: string;
  doctorCodigo: string;
  consultorio: string;
  motivo: string;
};

export type AppointmentDetail = AppointmentListItem & {
  pacienteId: string;
  doctorId: string;
  consultorioId: string;
  observaciones: string;
};

export type AppointmentFormOption = {
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

function formatTimeValue(value: string | null) {
  if (!value) {
    return "-";
  }

  return value.slice(0, 5);
}

function mapAppointmentRow(row: AppointmentRowBase): AppointmentDetail {
  return {
    id: String(row.id),
    pacienteId: String(row.paciente_id),
    doctorId: String(row.doctor_id),
    consultorioId: row.consultorio_id ? String(row.consultorio_id) : "",
    fecha: formatDateValue(row.fecha),
    horaInicio: formatTimeValue(row.hora_inicio),
    horaFin: formatTimeValue(row.hora_fin),
    estado: String(row.estado),
    paciente: String(row.paciente_nombre),
    pacienteExpediente: String(row.paciente_expediente),
    doctor: String(row.doctor_nombre),
    doctorCodigo: String(row.doctor_codigo),
    consultorio: row.consultorio_nombre ? String(row.consultorio_nombre) : "-",
    motivo: row.motivo ? String(row.motivo) : "-",
    observaciones: row.observaciones ? String(row.observaciones) : "",
  };
}

export async function getAppointmentsList() {
  const pool = getPool();
  const result = await pool.query<AppointmentRowBase>(
    `
      select
        c.id,
        c.paciente_id,
        c.doctor_id,
        c.consultorio_id,
        c.fecha,
        to_char(c.hora_inicio, 'HH24:MI') as hora_inicio,
        to_char(c.hora_fin, 'HH24:MI') as hora_fin,
        c.estado,
        c.motivo,
        c.observaciones,
        p.numero_expediente as paciente_expediente,
        concat(p.nombre, ' ', p.apellido_1, coalesce(' ' || p.apellido_2, '')) as paciente_nombre,
        d.codigo_colegiado as doctor_codigo,
        concat(u.nombre, ' ', u.apellido_1, coalesce(' ' || u.apellido_2, '')) as doctor_nombre,
        co.nombre as consultorio_nombre
      from citas c
      join pacientes p on p.id = c.paciente_id
      join doctores d on d.id = c.doctor_id
      join usuarios u on u.id = d.usuario_id
      left join consultorios co on co.id = c.consultorio_id
      order by c.fecha desc, c.hora_inicio desc
    `,
  );

  return result.rows.map((row) => {
    const mapped = mapAppointmentRow(row);

    return mapped satisfies AppointmentListItem;
  });
}

export async function getAppointmentDetail(appointmentId: string) {
  const pool = getPool();
  const result = await pool.query<AppointmentRowBase>(
    `
      select
        c.id,
        c.paciente_id,
        c.doctor_id,
        c.consultorio_id,
        c.fecha,
        to_char(c.hora_inicio, 'HH24:MI') as hora_inicio,
        to_char(c.hora_fin, 'HH24:MI') as hora_fin,
        c.estado,
        c.motivo,
        c.observaciones,
        p.numero_expediente as paciente_expediente,
        concat(p.nombre, ' ', p.apellido_1, coalesce(' ' || p.apellido_2, '')) as paciente_nombre,
        d.codigo_colegiado as doctor_codigo,
        concat(u.nombre, ' ', u.apellido_1, coalesce(' ' || u.apellido_2, '')) as doctor_nombre,
        co.nombre as consultorio_nombre
      from citas c
      join pacientes p on p.id = c.paciente_id
      join doctores d on d.id = c.doctor_id
      join usuarios u on u.id = d.usuario_id
      left join consultorios co on co.id = c.consultorio_id
      where c.id = $1
      limit 1
    `,
    [appointmentId],
  );

  const row = result.rows[0];
  return row ? mapAppointmentRow(row) : null;
}

export async function getAppointmentFormOptions() {
  const pool = getPool();

  const [patientsResult, doctorsResult, officesResult] = await Promise.all([
    pool.query(
      `
        select id, numero_expediente, concat(nombre, ' ', apellido_1, coalesce(' ' || apellido_2, '')) as paciente
        from pacientes
        where activo = true
        order by numero_expediente asc
      `,
    ),
    pool.query(
      `
        select d.id, d.codigo_colegiado, concat(u.nombre, ' ', u.apellido_1, coalesce(' ' || u.apellido_2, '')) as doctor
        from doctores d
        join usuarios u on u.id = d.usuario_id
        where u.activo = true
        order by d.codigo_colegiado asc
      `,
    ),
    pool.query(
      `
        select id, nombre, estado
        from consultorios
        order by nombre asc
      `,
    ),
  ]);

  return {
    patients: patientsResult.rows.map<AppointmentFormOption>((row) => ({
      id: String(row.id),
      label: `${row.numero_expediente} · ${row.paciente}`,
    })),
    doctors: doctorsResult.rows.map<AppointmentFormOption>((row) => ({
      id: String(row.id),
      label: `${row.codigo_colegiado} · ${row.doctor}`,
    })),
    offices: officesResult.rows.map<AppointmentFormOption>((row) => ({
      id: String(row.id),
      label: String(row.nombre),
      helper: String(row.estado),
    })),
  };
}
