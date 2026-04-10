"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getPool } from "@/lib/db";

export type PrescriptionFormState = {
  error: string | null;
};

function readPayload(formData: FormData) {
  return {
    expedienteId: String(formData.get("expedienteId") ?? "").trim(),
    medicamentoId: String(formData.get("medicamentoId") ?? "").trim(),
    dosis: String(formData.get("dosis") ?? "").trim(),
    frecuencia: String(formData.get("frecuencia") ?? "").trim(),
    duracion: String(formData.get("duracion") ?? "").trim(),
    indicaciones: String(formData.get("indicaciones") ?? "").trim(),
  };
}

function validatePayload(payload: ReturnType<typeof readPayload>) {
  if (!payload.expedienteId || !payload.medicamentoId || !payload.dosis || !payload.frecuencia || !payload.duracion) {
    return "Debes completar expediente, medicamento, dosis, frecuencia y duracion.";
  }

  return null;
}

export async function createPrescriptionAction(
  _previousState: PrescriptionFormState,
  formData: FormData,
): Promise<PrescriptionFormState> {
  const payload = readPayload(formData);
  const validationError = validatePayload(payload);

  if (validationError) {
    return { error: validationError };
  }

  const pool = getPool();

  try {
    await pool.query(
      `
        insert into recetas (
          expediente_id,
          medicamento_id,
          dosis,
          frecuencia,
          duracion,
          indicaciones
        )
        values ($1,$2,$3,$4,$5,$6)
      `,
      [
        payload.expedienteId,
        payload.medicamentoId,
        payload.dosis,
        payload.frecuencia,
        payload.duracion,
        payload.indicaciones || null,
      ],
    );
  } catch {
    return { error: "No se pudo crear la receta." };
  }

  revalidatePath("/recetas");
  redirect("/recetas");
}

export async function updatePrescriptionAction(
  prescriptionId: string,
  _previousState: PrescriptionFormState,
  formData: FormData,
): Promise<PrescriptionFormState> {
  const payload = readPayload(formData);
  const validationError = validatePayload(payload);

  if (validationError) {
    return { error: validationError };
  }

  const pool = getPool();

  try {
    await pool.query(
      `
        update recetas
        set
          expediente_id = $2,
          medicamento_id = $3,
          dosis = $4,
          frecuencia = $5,
          duracion = $6,
          indicaciones = $7
        where id = $1
      `,
      [
        prescriptionId,
        payload.expedienteId,
        payload.medicamentoId,
        payload.dosis,
        payload.frecuencia,
        payload.duracion,
        payload.indicaciones || null,
      ],
    );
  } catch {
    return { error: "No se pudo actualizar la receta." };
  }

  revalidatePath("/recetas");
  revalidatePath(`/recetas/${prescriptionId}`);
  redirect(`/recetas/${prescriptionId}`);
}

export async function deletePrescriptionAction(prescriptionId: string) {
  const pool = getPool();
  await pool.query(
    `
      delete from recetas
      where id = $1
    `,
    [prescriptionId],
  );

  revalidatePath("/recetas");
  redirect("/recetas");
}
