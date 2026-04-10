import "server-only";

import { getPool } from "@/lib/db";

export type InvoiceListItem = {
  id: string;
  numeroFactura: string;
  pacienteId: string;
  paciente: string;
  numeroExpediente: string;
  fechaEmision: string;
  montoTotal: string;
  saldoPendiente: string;
  saldoPendienteValor: number;
  estado: string;
  citaFecha: string;
};

export type InvoicePaymentItem = {
  id: string;
  metodoPago: string;
  monto: string;
  referencia: string;
  fechaPago: string;
};

export type InvoiceDetail = InvoiceListItem & {
  citaId: string;
  totalPagado: string;
  totalPagadoValor: number;
  pagos: InvoicePaymentItem[];
};

export type InvoiceFormOption = {
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

function formatCurrency(value: number | string | null) {
  const normalized = typeof value === "string" ? Number(value) : value ?? 0;

  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 2,
  }).format(normalized);
}

export async function getInvoicesList(patientId?: string) {
  const pool = getPool();
  const params: string[] = [];
  let whereClause = "";

  if (patientId) {
    params.push(patientId);
    whereClause = "where f.paciente_id = $1";
  }

  const result = await pool.query(
    `
      select
        f.id,
        f.paciente_id,
        f.cita_id,
        f.numero_factura,
        f.monto_total,
        f.estado,
        f.fecha_emision,
        p.numero_expediente,
        concat(p.nombre, ' ', p.apellido_1, coalesce(' ' || p.apellido_2, '')) as paciente,
        c.fecha as cita_fecha,
        coalesce(sum(pg.monto), 0)::numeric(12,2) as total_pagado
      from facturas f
      join pacientes p on p.id = f.paciente_id
      left join citas c on c.id = f.cita_id
      left join pagos pg on pg.factura_id = f.id
      ${whereClause}
      group by
        f.id,
        f.paciente_id,
        f.cita_id,
        f.numero_factura,
        f.monto_total,
        f.estado,
        f.fecha_emision,
        p.numero_expediente,
        p.nombre,
        p.apellido_1,
        p.apellido_2,
        c.fecha
      order by f.fecha_emision desc
    `,
    params,
  );

  return result.rows.map<InvoiceListItem>((row) => {
    const total = Number(row.monto_total ?? 0);
    const paid = Number(row.total_pagado ?? 0);

    return {
      id: String(row.id),
      numeroFactura: String(row.numero_factura),
      pacienteId: String(row.paciente_id),
      paciente: String(row.paciente),
      numeroExpediente: String(row.numero_expediente),
      fechaEmision: formatDateValue(row.fecha_emision),
      montoTotal: formatCurrency(total),
      saldoPendiente: formatCurrency(Math.max(total - paid, 0)),
      saldoPendienteValor: Math.max(total - paid, 0),
      estado: String(row.estado),
      citaFecha: formatDateValue(row.cita_fecha),
    };
  });
}

export async function getInvoiceDetail(invoiceId: string) {
  const pool = getPool();
  const invoiceResult = await pool.query(
    `
      select
        f.id,
        f.paciente_id,
        f.cita_id,
        f.numero_factura,
        f.monto_total,
        f.estado,
        f.fecha_emision,
        p.numero_expediente,
        concat(p.nombre, ' ', p.apellido_1, coalesce(' ' || p.apellido_2, '')) as paciente,
        c.fecha as cita_fecha,
        coalesce(sum(pg.monto), 0)::numeric(12,2) as total_pagado
      from facturas f
      join pacientes p on p.id = f.paciente_id
      left join citas c on c.id = f.cita_id
      left join pagos pg on pg.factura_id = f.id
      where f.id = $1
      group by
        f.id,
        f.paciente_id,
        f.cita_id,
        f.numero_factura,
        f.monto_total,
        f.estado,
        f.fecha_emision,
        p.numero_expediente,
        p.nombre,
        p.apellido_1,
        p.apellido_2,
        c.fecha
      limit 1
    `,
    [invoiceId],
  );

  const row = invoiceResult.rows[0];

  if (!row) {
    return null;
  }

  const paymentsResult = await pool.query(
    `
      select
        id,
        metodo_pago,
        monto,
        referencia,
        fecha_pago
      from pagos
      where factura_id = $1
      order by fecha_pago desc
    `,
    [invoiceId],
  );

  const total = Number(row.monto_total ?? 0);
  const paid = Number(row.total_pagado ?? 0);

  return {
    id: String(row.id),
    numeroFactura: String(row.numero_factura),
    pacienteId: String(row.paciente_id),
    paciente: String(row.paciente),
    numeroExpediente: String(row.numero_expediente),
    fechaEmision: formatDateValue(row.fecha_emision),
    montoTotal: formatCurrency(total),
    saldoPendiente: formatCurrency(Math.max(total - paid, 0)),
    saldoPendienteValor: Math.max(total - paid, 0),
    totalPagado: formatCurrency(paid),
    totalPagadoValor: paid,
    estado: String(row.estado),
    citaId: row.cita_id ? String(row.cita_id) : "",
    citaFecha: formatDateValue(row.cita_fecha),
    pagos: paymentsResult.rows.map<InvoicePaymentItem>((payment) => ({
      id: String(payment.id),
      metodoPago: String(payment.metodo_pago),
      monto: formatCurrency(payment.monto),
      referencia: payment.referencia ? String(payment.referencia) : "-",
      fechaPago: formatDateValue(payment.fecha_pago),
    })),
  } satisfies InvoiceDetail;
}

export async function getInvoiceFormOptions() {
  const pool = getPool();
  const [patientsResult, appointmentsResult] = await Promise.all([
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
        select
          c.id,
          p.numero_expediente,
          concat(p.nombre, ' ', p.apellido_1, coalesce(' ' || p.apellido_2, '')) as paciente,
          c.fecha,
          to_char(c.hora_inicio, 'HH24:MI') as hora_inicio
        from citas c
        join pacientes p on p.id = c.paciente_id
        left join facturas f on f.cita_id = c.id
        where f.id is null
        order by c.fecha desc, c.hora_inicio desc
      `,
    ),
  ]);

  return {
    patients: patientsResult.rows.map<InvoiceFormOption>((row) => ({
      id: String(row.id),
      label: `${row.numero_expediente} · ${row.paciente}`,
    })),
    appointments: appointmentsResult.rows.map<InvoiceFormOption>((row) => ({
      id: String(row.id),
      label: `${row.numero_expediente} · ${row.paciente}`,
      helper: `${formatDateValue(row.fecha)} ${String(row.hora_inicio)}`,
    })),
  };
}
