import "server-only";

import { getPool } from "@/lib/db";

export type MedicalRecordListItem = {
  id: string;
  pacienteId: string;
  paciente: string;
  numeroExpediente: string;
  doctor: string;
  doctorCodigo: string;
  fechaCita: string;
  fechaRegistro: string;
  diagnostico: string;
};

export type MedicalRecordDetail = MedicalRecordListItem & {
  citaId: string;
  doctorId: string;
  sintomas: string;
  tratamiento: string;
  notas: string;
};

export type MedicalRecordFormOption = {
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

export async function getMedicalRecordsList(patientId?: string) {
  const pool = getPool();
  const params: string[] = [];
  let whereClause = "";

  if (patientId) {
    params.push(patientId);
    whereClause = "where ex.paciente_id = $1";
  }

  const result = await pool.query(
    `
      select
        ex.id,
        ex.paciente_id,
        ex.cita_id,
        ex.doctor_id,
        ex.diagnostico,
        ex.fecha_registro,
        p.numero_expediente,
        concat(p.nombre, ' ', p.apellido_1, coalesce(' ' || p.apellido_2, '')) as paciente,
        d.codigo_colegiado as doctor_codigo,
        concat(u.nombre, ' ', u.apellido_1, coalesce(' ' || u.apellido_2, '')) as doctor,
        c.fecha as fecha_cita
      from expedientes ex
      join pacientes p on p.id = ex.paciente_id
      join doctores d on d.id = ex.doctor_id
      join usuarios u on u.id = d.usuario_id
      left join citas c on c.id = ex.cita_id
      ${whereClause}
      order by ex.fecha_registro desc
    `,
    params,
  );

  return result.rows.map<MedicalRecordListItem>((row) => ({
    id: String(row.id),
    pacienteId: String(row.paciente_id),
    paciente: String(row.paciente),
    numeroExpediente: String(row.numero_expediente),
    doctor: String(row.doctor),
    doctorCodigo: String(row.doctor_codigo),
    fechaCita: formatDateValue(row.fecha_cita),
    fechaRegistro: formatDateValue(row.fecha_registro),
    diagnostico: String(row.diagnostico),
  }));
}

export async function getMedicalRecordDetail(recordId: string) {
  const pool = getPool();
  const result = await pool.query(
    `
      select
        ex.id,
        ex.paciente_id,
        ex.cita_id,
        ex.doctor_id,
        ex.diagnostico,
        ex.sintomas,
        ex.tratamiento,
        ex.notas,
        ex.fecha_registro,
        p.numero_expediente,
        concat(p.nombre, ' ', p.apellido_1, coalesce(' ' || p.apellido_2, '')) as paciente,
        d.codigo_colegiado as doctor_codigo,
        concat(u.nombre, ' ', u.apellido_1, coalesce(' ' || u.apellido_2, '')) as doctor,
        c.fecha as fecha_cita
      from expedientes ex
      join pacientes p on p.id = ex.paciente_id
      join doctores d on d.id = ex.doctor_id
      join usuarios u on u.id = d.usuario_id
      left join citas c on c.id = ex.cita_id
      where ex.id = $1
      limit 1
    `,
    [recordId],
  );

  const row = result.rows[0];

  if (!row) {
    return null;
  }

  return {
    id: String(row.id),
    pacienteId: String(row.paciente_id),
    citaId: row.cita_id ? String(row.cita_id) : "",
    doctorId: String(row.doctor_id),
    paciente: String(row.paciente),
    numeroExpediente: String(row.numero_expediente),
    doctor: String(row.doctor),
    doctorCodigo: String(row.doctor_codigo),
    fechaCita: formatDateValue(row.fecha_cita),
    fechaRegistro: formatDateValue(row.fecha_registro),
    diagnostico: String(row.diagnostico),
    sintomas: row.sintomas ? String(row.sintomas) : "",
    tratamiento: row.tratamiento ? String(row.tratamiento) : "",
    notas: row.notas ? String(row.notas) : "",
  } satisfies MedicalRecordDetail;
}

export async function getMedicalRecordFormOptions() {
  const pool = getPool();
  const [patientsResult, doctorsResult, appointmentsResult] = await Promise.all([
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
        select
          c.id,
          p.numero_expediente,
          concat(p.nombre, ' ', p.apellido_1, coalesce(' ' || p.apellido_2, '')) as paciente,
          d.codigo_colegiado,
          concat(u.nombre, ' ', u.apellido_1, coalesce(' ' || u.apellido_2, '')) as doctor,
          c.fecha,
          to_char(c.hora_inicio, 'HH24:MI') as hora_inicio
        from citas c
        join pacientes p on p.id = c.paciente_id
        join doctores d on d.id = c.doctor_id
        join usuarios u on u.id = d.usuario_id
        left join expedientes ex on ex.cita_id = c.id
        where ex.id is null
          and c.estado in ('atendida', 'confirmada', 'programada')
        order by c.fecha desc, c.hora_inicio desc
      `,
    ),
  ]);

  return {
    patients: patientsResult.rows.map<MedicalRecordFormOption>((row) => ({
      id: String(row.id),
      label: `${row.numero_expediente} · ${row.paciente}`,
    })),
    doctors: doctorsResult.rows.map<MedicalRecordFormOption>((row) => ({
      id: String(row.id),
      label: `${row.codigo_colegiado} · ${row.doctor}`,
    })),
    appointments: appointmentsResult.rows.map<MedicalRecordFormOption>((row) => ({
      id: String(row.id),
      label: `${row.numero_expediente} · ${row.paciente}`,
      helper: `${formatDateValue(row.fecha)} ${String(row.hora_inicio)} · ${row.codigo_colegiado} ${row.doctor}`,
    })),
  };
}
