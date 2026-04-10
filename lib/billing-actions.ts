"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { QueryResult, QueryResultRow } from "pg";

import { getPool } from "@/lib/db";

export type InvoiceFormState = {
  error: string | null;
};

export type PaymentFormState = {
  error: string | null;
};

type InvoicePayload = {
  numeroFactura: string;
  pacienteId: string;
  citaId: string;
  montoTotal: string;
};

type PaymentPayload = {
  metodoPago: string;
  monto: string;
};

function readInvoicePayload(formData: FormData): InvoicePayload {
  return {
    numeroFactura: String(formData.get("numeroFactura") ?? "").trim(),
    pacienteId: String(formData.get("pacienteId") ?? "").trim(),
    citaId: String(formData.get("citaId") ?? "").trim(),
    montoTotal: String(formData.get("montoTotal") ?? "").trim(),
  };
}

function readPaymentPayload(formData: FormData): PaymentPayload {
  return {
    metodoPago: String(formData.get("metodoPago") ?? "").trim(),
    monto: String(formData.get("monto") ?? "").trim(),
  };
}

function validateInvoicePayload(payload: InvoicePayload) {
  if (!payload.pacienteId || !payload.montoTotal) {
    return "Debes completar paciente y monto total de la factura.";
  }

  const amount = Number(payload.montoTotal);

  if (!Number.isFinite(amount) || amount <= 0) {
    return "El monto total debe ser mayor que cero.";
  }

  return null;
}

function validatePaymentPayload(payload: PaymentPayload) {
  if (!payload.metodoPago || !payload.monto) {
    return "Debes seleccionar un metodo de pago e indicar el monto simulado.";
  }

  const amount = Number(payload.monto);

  if (!Number.isFinite(amount) || amount <= 0) {
    return "El monto del pago debe ser mayor que cero.";
  }

  return null;
}

async function generateNextInvoiceNumber() {
  const pool = getPool();
  const result = await pool.query<{ numero_factura: string }>(
    `
      select numero_factura
      from facturas
      where numero_factura ~ '^FAC-[0-9]{4}$'
      order by numero_factura desc
      limit 1
    `,
  );

  const current = result.rows[0]?.numero_factura;

  if (!current) {
    return "FAC-0001";
  }

  const currentNumber = Number(current.split("-")[1] ?? "0");
  const nextNumber = String(currentNumber + 1).padStart(4, "0");

  return `FAC-${nextNumber}`;
}

async function resolveInvoicePatient(payload: InvoicePayload) {
  if (!payload.citaId) {
    return payload;
  }

  const pool = getPool();
  const result = await pool.query<{ paciente_id: string }>(
    `
      select paciente_id
      from citas
      where id = $1
      limit 1
    `,
    [payload.citaId],
  );

  const row = result.rows[0];

  if (!row) {
    return null;
  }

  return {
    ...payload,
    pacienteId: String(row.paciente_id),
  };
}

type QueryableClient = {
  query: <T extends QueryResultRow = QueryResultRow>(
    queryText: string,
    values?: unknown[],
  ) => Promise<QueryResult<T>>;
};

async function syncInvoiceStatus(invoiceId: string, client: QueryableClient = getPool()) {
  const totalsResult = await client.query<{ monto_total: string; total_pagado: string }>(
    `
      select
        f.monto_total,
        coalesce(sum(p.monto), 0)::numeric(12,2) as total_pagado
      from facturas f
      left join pagos p on p.factura_id = f.id
      where f.id = $1
      group by f.id, f.monto_total
    `,
    [invoiceId],
  );

  const totals = totalsResult.rows[0];

  if (!totals) {
    return;
  }

  const total = Number(totals.monto_total ?? 0);
  const paid = Number(totals.total_pagado ?? 0);

  let nextStatus = "pendiente";

  if (paid >= total) {
    nextStatus = "pagada";
  } else if (paid > 0) {
    nextStatus = "parcial";
  }

  await client.query(
    `
      update facturas
      set estado = $2
      where id = $1
    `,
    [invoiceId, nextStatus],
  );
}

function buildSimulatedReference(method: string) {
  const prefixByMethod: Record<string, string> = {
    tarjeta: "SIM-TCJ",
    efectivo: "SIM-EFE",
    transferencia: "SIM-TRF",
    sinpe: "SIM-SINPE",
  };

  const prefix = prefixByMethod[method] ?? "SIM-PAGO";
  const timestamp = Date.now();

  return `${prefix}-${timestamp}`;
}

export async function createInvoiceAction(
  _previousState: InvoiceFormState,
  formData: FormData,
): Promise<InvoiceFormState> {
  const payload = readInvoicePayload(formData);
  const normalizedPayload = await resolveInvoicePatient(payload);

  if (!normalizedPayload) {
    return { error: "La cita seleccionada no existe o no se pudo validar." };
  }

  const validationError = validateInvoicePayload(normalizedPayload);

  if (validationError) {
    return { error: validationError };
  }

  const pool = getPool();
  const numeroFactura = normalizedPayload.numeroFactura || await generateNextInvoiceNumber();

  try {
    await pool.query(
      `
        insert into facturas (
          paciente_id,
          cita_id,
          numero_factura,
          monto_total,
          estado
        )
        values ($1,$2,$3,$4,'pendiente')
      `,
      [
        normalizedPayload.pacienteId,
        normalizedPayload.citaId || null,
        numeroFactura,
        Number(normalizedPayload.montoTotal),
      ],
    );
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("numero_factura")
        ? "Ya existe una factura con ese numero."
        : "No se pudo crear la factura.";

    return { error: message };
  }

  revalidatePath("/facturas");
  revalidatePath(`/pacientes/${normalizedPayload.pacienteId}`);
  redirect("/facturas");
}

export async function processSimulatedPaymentAction(
  invoiceId: string,
  _previousState: PaymentFormState,
  formData: FormData,
): Promise<PaymentFormState> {
  const payload = readPaymentPayload(formData);
  const validationError = validatePaymentPayload(payload);

  if (validationError) {
    return { error: validationError };
  }

  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("begin");

    const invoiceResult = await client.query<{ monto_total: string; total_pagado: string; paciente_id: string }>(
      `
        select
          f.monto_total,
          f.paciente_id,
          coalesce(sum(p.monto), 0)::numeric(12,2) as total_pagado
        from facturas f
        left join pagos p on p.factura_id = f.id
        where f.id = $1
        group by f.id, f.monto_total, f.paciente_id
        limit 1
      `,
      [invoiceId],
    );

    const invoice = invoiceResult.rows[0];

    if (!invoice) {
      await client.query("rollback");
      return { error: "No se encontro la factura seleccionada." };
    }

    const total = Number(invoice.monto_total ?? 0);
    const paid = Number(invoice.total_pagado ?? 0);
    const nextPayment = Number(payload.monto);

    if (paid + nextPayment > total) {
      await client.query("rollback");
      return { error: "El pago simulado excede el saldo pendiente de la factura." };
    }

    await client.query(
      `
        insert into pagos (
          factura_id,
          metodo_pago,
          monto,
          referencia
        )
        values ($1,$2,$3,$4)
      `,
      [
        invoiceId,
        payload.metodoPago,
        nextPayment,
        buildSimulatedReference(payload.metodoPago),
      ],
    );

    await syncInvoiceStatus(invoiceId, client);
    await client.query("commit");

    revalidatePath("/facturas");
    revalidatePath(`/facturas/${invoiceId}`);
    revalidatePath(`/pacientes/${invoice.paciente_id}`);
  } catch {
    await client.query("rollback");
    return { error: "No se pudo registrar el pago simulado." };
  } finally {
    client.release();
  }

  redirect(`/facturas/${invoiceId}`);
}
