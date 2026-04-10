"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getPool } from "@/lib/db";

export type AppointmentFormState = {
  error: string | null;
};

type AppointmentPayload = {
  pacienteId: string;
  doctorId: string;
  consultorioId: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: string;
  motivo: string;
  observaciones: string;
};

function readAppointmentPayload(formData: FormData): AppointmentPayload {
  return {
    pacienteId: String(formData.get("pacienteId") ?? "").trim(),
    doctorId: String(formData.get("doctorId") ?? "").trim(),
    consultorioId: String(formData.get("consultorioId") ?? "").trim(),
    fecha: String(formData.get("fecha") ?? "").trim(),
    horaInicio: String(formData.get("horaInicio") ?? "").trim(),
    horaFin: String(formData.get("horaFin") ?? "").trim(),
    estado: String(formData.get("estado") ?? "").trim(),
    motivo: String(formData.get("motivo") ?? "").trim(),
    observaciones: String(formData.get("observaciones") ?? "").trim(),
  };
}

function validateAppointmentPayload(payload: AppointmentPayload) {
  if (
    !payload.pacienteId ||
    !payload.doctorId ||
    !payload.fecha ||
    !payload.horaInicio ||
    !payload.horaFin
  ) {
    return "Debes completar paciente, doctor, fecha y horario de la cita.";
  }

  if (payload.horaFin <= payload.horaInicio) {
    return "La hora final debe ser mayor que la hora de inicio.";
  }

  return null;
}

async function hasScheduleConflict(
  doctorId: string,
  fecha: string,
  horaInicio: string,
  horaFin: string,
  excludeId?: string,
) {
  const pool = getPool();
  const result = await pool.query(
    `
      select 1
      from citas
      where doctor_id = $1
        and fecha = $2::date
        and estado <> 'cancelada'
        and id <> coalesce($5::uuid, id)
        and ($3::time < hora_fin and $4::time > hora_inicio)
      limit 1
    `,
    [doctorId, fecha, horaInicio, horaFin, excludeId ?? null],
  );

  return (result.rowCount ?? 0) > 0;
}

export async function createAppointmentAction(
  _previousState: AppointmentFormState,
  formData: FormData,
): Promise<AppointmentFormState> {
  const payload = readAppointmentPayload(formData);
  const validationError = validateAppointmentPayload(payload);

  if (validationError) {
    return { error: validationError };
  }

  if (await hasScheduleConflict(payload.doctorId, payload.fecha, payload.horaInicio, payload.horaFin)) {
    return { error: "Ese doctor ya tiene una cita en ese horario." };
  }

  const pool = getPool();

  await pool.query(
    `
      insert into citas (
        paciente_id,
        doctor_id,
        consultorio_id,
        fecha,
        hora_inicio,
        hora_fin,
        estado,
        motivo,
        observaciones
      )
      values ($1,$2,$3,$4::date,$5::time,$6::time,$7,$8,$9)
    `,
    [
      payload.pacienteId,
      payload.doctorId,
      payload.consultorioId || null,
      payload.fecha,
      payload.horaInicio,
      payload.horaFin,
      payload.estado || "programada",
      payload.motivo || null,
      payload.observaciones || null,
    ],
  );

  revalidatePath("/citas");
  revalidatePath("/dashboard");
  revalidatePath("/reportes");
  redirect("/citas");
}

export async function updateAppointmentAction(
  appointmentId: string,
  _previousState: AppointmentFormState,
  formData: FormData,
): Promise<AppointmentFormState> {
  const payload = readAppointmentPayload(formData);
  const validationError = validateAppointmentPayload(payload);

  if (validationError) {
    return { error: validationError };
  }

  if (
    await hasScheduleConflict(
      payload.doctorId,
      payload.fecha,
      payload.horaInicio,
      payload.horaFin,
      appointmentId,
    )
  ) {
    return { error: "Ese doctor ya tiene otra cita en ese horario." };
  }

  const pool = getPool();

  await pool.query(
    `
      update citas
      set
        paciente_id = $2,
        doctor_id = $3,
        consultorio_id = $4,
        fecha = $5::date,
        hora_inicio = $6::time,
        hora_fin = $7::time,
        estado = $8,
        motivo = $9,
        observaciones = $10
      where id = $1
    `,
    [
      appointmentId,
      payload.pacienteId,
      payload.doctorId,
      payload.consultorioId || null,
      payload.fecha,
      payload.horaInicio,
      payload.horaFin,
      payload.estado || "programada",
      payload.motivo || null,
      payload.observaciones || null,
    ],
  );

  revalidatePath("/citas");
  revalidatePath(`/citas/${appointmentId}`);
  revalidatePath("/dashboard");
  revalidatePath("/reportes");
  redirect(`/citas/${appointmentId}`);
}

export async function cancelAppointmentAction(appointmentId: string) {
  const pool = getPool();

  await pool.query(
    `
      update citas
      set estado = 'cancelada'
      where id = $1
    `,
    [appointmentId],
  );

  revalidatePath("/citas");
  revalidatePath(`/citas/${appointmentId}`);
  revalidatePath("/dashboard");
  revalidatePath("/reportes");
  redirect("/citas");
}
