"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getPool } from "@/lib/db";

export type MedicalRecordFormState = {
  error: string | null;
};

type MedicalRecordPayload = {
  pacienteId: string;
  citaId: string;
  doctorId: string;
  diagnostico: string;
  sintomas: string;
  tratamiento: string;
  notas: string;
};

function readMedicalRecordPayload(formData: FormData): MedicalRecordPayload {
  return {
    pacienteId: String(formData.get("pacienteId") ?? "").trim(),
    citaId: String(formData.get("citaId") ?? "").trim(),
    doctorId: String(formData.get("doctorId") ?? "").trim(),
    diagnostico: String(formData.get("diagnostico") ?? "").trim(),
    sintomas: String(formData.get("sintomas") ?? "").trim(),
    tratamiento: String(formData.get("tratamiento") ?? "").trim(),
    notas: String(formData.get("notas") ?? "").trim(),
  };
}

function validateMedicalRecordPayload(payload: MedicalRecordPayload) {
  if (!payload.pacienteId || !payload.doctorId || !payload.diagnostico) {
    return "Debes completar paciente, doctor y diagnostico.";
  }

  return null;
}

async function resolvePayloadAgainstAppointment(payload: MedicalRecordPayload) {
  if (!payload.citaId) {
    return payload;
  }

  const pool = getPool();
  const result = await pool.query<{ paciente_id: string; doctor_id: string }>(
    `
      select paciente_id, doctor_id
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
    doctorId: String(row.doctor_id),
  };
}

async function appointmentAlreadyLinked(citaId: string, excludeId?: string) {
  if (!citaId) {
    return false;
  }

  const pool = getPool();
  const result = await pool.query(
    `
      select 1
      from expedientes
      where cita_id = $1
        and id <> coalesce($2::uuid, id)
      limit 1
    `,
    [citaId, excludeId ?? null],
  );

  return (result.rowCount ?? 0) > 0;
}

export async function createMedicalRecordAction(
  _previousState: MedicalRecordFormState,
  formData: FormData,
): Promise<MedicalRecordFormState> {
  const payload = readMedicalRecordPayload(formData);
  const normalizedPayload = await resolvePayloadAgainstAppointment(payload);

  if (!normalizedPayload) {
    return { error: "La cita seleccionada ya no existe o no se pudo validar." };
  }

  const validationError = validateMedicalRecordPayload(normalizedPayload);

  if (validationError) {
    return { error: validationError };
  }

  if (await appointmentAlreadyLinked(normalizedPayload.citaId)) {
    return { error: "Esa cita ya tiene un expediente asociado." };
  }

  const pool = getPool();

  await pool.query(
    `
      insert into expedientes (
        paciente_id,
        cita_id,
        doctor_id,
        diagnostico,
        sintomas,
        tratamiento,
        notas
      )
      values ($1,$2,$3,$4,$5,$6,$7)
    `,
    [
      normalizedPayload.pacienteId,
      normalizedPayload.citaId || null,
      normalizedPayload.doctorId,
      normalizedPayload.diagnostico,
      normalizedPayload.sintomas || null,
      normalizedPayload.tratamiento || null,
      normalizedPayload.notas || null,
    ],
  );

  revalidatePath("/expedientes");
  revalidatePath(`/pacientes/${normalizedPayload.pacienteId}`);
  revalidatePath("/citas");
  redirect(
    normalizedPayload.pacienteId
      ? `/expedientes?pacienteId=${normalizedPayload.pacienteId}`
      : "/expedientes",
  );
}

export async function updateMedicalRecordAction(
  recordId: string,
  _previousState: MedicalRecordFormState,
  formData: FormData,
): Promise<MedicalRecordFormState> {
  const payload = readMedicalRecordPayload(formData);
  const normalizedPayload = await resolvePayloadAgainstAppointment(payload);

  if (!normalizedPayload) {
    return { error: "La cita seleccionada ya no existe o no se pudo validar." };
  }

  const validationError = validateMedicalRecordPayload(normalizedPayload);

  if (validationError) {
    return { error: validationError };
  }

  if (await appointmentAlreadyLinked(normalizedPayload.citaId, recordId)) {
    return { error: "Esa cita ya tiene otro expediente asociado." };
  }

  const pool = getPool();

  await pool.query(
    `
      update expedientes
      set
        paciente_id = $2,
        cita_id = $3,
        doctor_id = $4,
        diagnostico = $5,
        sintomas = $6,
        tratamiento = $7,
        notas = $8
      where id = $1
    `,
    [
      recordId,
      normalizedPayload.pacienteId,
      normalizedPayload.citaId || null,
      normalizedPayload.doctorId,
      normalizedPayload.diagnostico,
      normalizedPayload.sintomas || null,
      normalizedPayload.tratamiento || null,
      normalizedPayload.notas || null,
    ],
  );

  revalidatePath("/expedientes");
  revalidatePath(`/expedientes/${recordId}`);
  revalidatePath(`/pacientes/${normalizedPayload.pacienteId}`);
  revalidatePath("/citas");
  redirect(`/expedientes/${recordId}`);
}
