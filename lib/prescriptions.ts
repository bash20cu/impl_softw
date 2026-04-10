import "server-only";

import { getPool } from "@/lib/db";

export type PrescriptionListItem = {
  id: string;
  expedienteId: string;
  paciente: string;
  numeroExpediente: string;
  medicamento: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
};

export type PrescriptionDetail = PrescriptionListItem & {
  indicaciones: string;
};

export type PrescriptionFormOption = {
  id: string;
  label: string;
  helper?: string;
};

export async function getPrescriptions() {
  const pool = getPool();
  const result = await pool.query(
    `
      select
        r.id,
        r.expediente_id,
        r.dosis,
        r.frecuencia,
        r.duracion,
        r.indicaciones,
        m.nombre as medicamento,
        p.numero_expediente,
        concat(p.nombre, ' ', p.apellido_1, coalesce(' ' || p.apellido_2, '')) as paciente
      from recetas r
      join expedientes e on e.id = r.expediente_id
      join pacientes p on p.id = e.paciente_id
      join medicamentos m on m.id = r.medicamento_id
      order by r.created_at desc
    `,
  );

  return result.rows.map<PrescriptionListItem>((row) => ({
    id: String(row.id),
    expedienteId: String(row.expediente_id),
    paciente: String(row.paciente),
    numeroExpediente: String(row.numero_expediente),
    medicamento: String(row.medicamento),
    dosis: String(row.dosis),
    frecuencia: String(row.frecuencia),
    duracion: String(row.duracion),
  }));
}

export async function getPrescriptionById(id: string) {
  const pool = getPool();
  const result = await pool.query(
    `
      select
        r.id,
        r.expediente_id,
        r.medicamento_id,
        r.dosis,
        r.frecuencia,
        r.duracion,
        r.indicaciones,
        m.nombre as medicamento,
        p.numero_expediente,
        concat(p.nombre, ' ', p.apellido_1, coalesce(' ' || p.apellido_2, '')) as paciente
      from recetas r
      join expedientes e on e.id = r.expediente_id
      join pacientes p on p.id = e.paciente_id
      join medicamentos m on m.id = r.medicamento_id
      where r.id = $1
      limit 1
    `,
    [id],
  );

  const row = result.rows[0];

  return row
    ? {
        id: String(row.id),
        expedienteId: String(row.expediente_id),
        medicamentoId: String(row.medicamento_id),
        paciente: String(row.paciente),
        numeroExpediente: String(row.numero_expediente),
        medicamento: String(row.medicamento),
        dosis: String(row.dosis),
        frecuencia: String(row.frecuencia),
        duracion: String(row.duracion),
        indicaciones: row.indicaciones ? String(row.indicaciones) : "",
      }
    : null;
}

export async function getPrescriptionFormOptions() {
  const pool = getPool();
  const [recordsResult, medicinesResult] = await Promise.all([
    pool.query(
      `
        select
          e.id,
          p.numero_expediente,
          concat(p.nombre, ' ', p.apellido_1, coalesce(' ' || p.apellido_2, '')) as paciente,
          ex.diagnostico
        from expedientes e
        join pacientes p on p.id = e.paciente_id
        join expedientes ex on ex.id = e.id
        order by ex.fecha_registro desc
      `,
    ),
    pool.query(
      `
        select id, nombre, presentacion
        from medicamentos
        where activo = true
        order by nombre asc
      `,
    ),
  ]);

  return {
    records: recordsResult.rows.map<PrescriptionFormOption>((row) => ({
      id: String(row.id),
      label: `${row.numero_expediente} · ${row.paciente}`,
      helper: row.diagnostico ? String(row.diagnostico) : undefined,
    })),
    medicines: medicinesResult.rows.map<PrescriptionFormOption>((row) => ({
      id: String(row.id),
      label: String(row.nombre),
      helper: row.presentacion ? String(row.presentacion) : undefined,
    })),
  };
}
