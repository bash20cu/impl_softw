import "server-only";

import { getPool } from "@/lib/db";
import {
  getReportDefinition,
  type ReportFilterValues,
  type ReportId,
  type ReportRow,
} from "@/lib/reporting";

function formatDateValue(value: Date | string | null) {
  if (!value) {
    return "-";
  }

  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  return value.toISOString().slice(0, 10);
}

function formatCurrency(value: number | string | null) {
  const normalized = typeof value === "string" ? Number(value) : value ?? 0;

  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
  }).format(normalized);
}

async function runAppointmentsReport(filters: ReportFilterValues): Promise<ReportRow[]> {
  const pool = getPool();
  const result = await pool.query(
    `
      select
        c.fecha,
        to_char(c.hora_inicio, 'HH24:MI') as hora_inicio,
        to_char(c.hora_fin, 'HH24:MI') as hora_fin,
        c.estado,
        concat(p.nombre, ' ', p.apellido_1, coalesce(' ' || p.apellido_2, '')) as paciente,
        concat(u.nombre, ' ', u.apellido_1, coalesce(' ' || u.apellido_2, '')) as doctor,
        e.nombre as especialidad,
        coalesce(co.nombre, '-') as consultorio,
        d.codigo_colegiado as codigo_doctor
      from citas c
      join pacientes p on p.id = c.paciente_id
      join doctores d on d.id = c.doctor_id
      join usuarios u on u.id = d.usuario_id
      join especialidades e on e.id = d.especialidad_id
      left join consultorios co on co.id = c.consultorio_id
      where c.fecha between $1::date and $2::date
        and ($3::varchar = '' or d.codigo_colegiado = $3::varchar)
        and ($4::varchar = '' or c.estado = $4::varchar)
      order by c.fecha, c.hora_inicio, doctor, paciente
    `,
    [
      filters.fecha_inicio,
      filters.fecha_fin,
      filters.codigo_doctor ?? "",
      filters.estado ?? "",
    ],
  );

  return result.rows.map((row) => ({
    fecha: formatDateValue(row.fecha),
    hora_inicio: String(row.hora_inicio),
    hora_fin: String(row.hora_fin),
    estado: String(row.estado),
    paciente: String(row.paciente),
    doctor: String(row.doctor),
    especialidad: String(row.especialidad),
    consultorio: String(row.consultorio),
  }));
}

async function runPatientsPaymentsReport(filters: ReportFilterValues): Promise<ReportRow[]> {
  const pool = getPool();
  const result = await pool.query(
    `
      select
        p.numero_expediente,
        concat(p.nombre, ' ', p.apellido_1, coalesce(' ' || p.apellido_2, '')) as paciente,
        count(distinct ex.id) as consultas_atendidas,
        count(distinct f.id) as facturas_emitidas,
        coalesce(sum(pg.monto), 0)::numeric(12,2) as total_pagado,
        min(ex.fecha_registro)::date as primera_atencion_periodo,
        max(ex.fecha_registro)::date as ultima_atencion_periodo
      from pacientes p
      left join expedientes ex
        on ex.paciente_id = p.id
        and ex.fecha_registro::date between $1::date and $2::date
      left join facturas f
        on f.paciente_id = p.id
        and f.fecha_emision::date between $1::date and $2::date
      left join pagos pg
        on pg.factura_id = f.id
        and pg.fecha_pago::date between $1::date and $2::date
      group by p.id, p.numero_expediente, p.nombre, p.apellido_1, p.apellido_2
      having count(distinct ex.id) > 0
        or count(distinct f.id) > 0
        or coalesce(sum(pg.monto), 0) > 0
      order by total_pagado desc, consultas_atendidas desc, paciente asc
    `,
    [filters.fecha_inicio, filters.fecha_fin],
  );

  return result.rows.map((row) => ({
    numero_expediente: String(row.numero_expediente),
    paciente: String(row.paciente),
    consultas_atendidas: Number(row.consultas_atendidas),
    facturas_emitidas: Number(row.facturas_emitidas),
    total_pagado: formatCurrency(row.total_pagado),
    primera_atencion_periodo: formatDateValue(row.primera_atencion_periodo),
    ultima_atencion_periodo: formatDateValue(row.ultima_atencion_periodo),
  }));
}

export async function runReport(reportId: ReportId, filters: ReportFilterValues) {
  switch (reportId) {
    case "citas-por-doctor":
      return runAppointmentsReport(filters);
    case "pacientes-y-pagos":
      return runPatientsPaymentsReport(filters);
    default:
      return [];
  }
}

export async function getReportData(reportId: ReportId, filters: ReportFilterValues) {
  const definition = getReportDefinition(reportId);
  const rows = await runReport(reportId, filters);

  return {
    definition,
    rows,
  };
}
