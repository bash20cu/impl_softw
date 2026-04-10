"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getPool } from "@/lib/db";

export type PatientFormState = {
  error: string | null;
};

type PatientPayload = {
  numeroExpediente: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  fechaNacimiento: string;
  genero: string;
  telefono: string;
  email: string;
  direccion: string;
  contactoEmergenciaNombre: string;
  contactoEmergenciaTelefono: string;
};

function readPatientPayload(formData: FormData): PatientPayload {
  return {
    numeroExpediente: String(formData.get("numeroExpediente") ?? "").trim(),
    nombre: String(formData.get("nombre") ?? "").trim(),
    apellido1: String(formData.get("apellido1") ?? "").trim(),
    apellido2: String(formData.get("apellido2") ?? "").trim(),
    fechaNacimiento: String(formData.get("fechaNacimiento") ?? "").trim(),
    genero: String(formData.get("genero") ?? "").trim(),
    telefono: String(formData.get("telefono") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    direccion: String(formData.get("direccion") ?? "").trim(),
    contactoEmergenciaNombre: String(formData.get("contactoEmergenciaNombre") ?? "").trim(),
    contactoEmergenciaTelefono: String(formData.get("contactoEmergenciaTelefono") ?? "").trim(),
  };
}

function validatePatientPayload(payload: PatientPayload) {
  if (
    !payload.nombre ||
    !payload.apellido1 ||
    !payload.fechaNacimiento
  ) {
    return "Debes completar nombre, primer apellido y fecha de nacimiento.";
  }

  return null;
}

async function generateNextExpedientNumber() {
  const pool = getPool();
  const result = await pool.query<{ numero_expediente: string }>(
    `
      select numero_expediente
      from pacientes
      where numero_expediente ~ '^EXP-[0-9]{4}$'
      order by numero_expediente desc
      limit 1
    `,
  );

  const current = result.rows[0]?.numero_expediente;

  if (!current) {
    return "EXP-0001";
  }

  const currentNumber = Number(current.split("-")[1] ?? "0");
  const nextNumber = String(currentNumber + 1).padStart(4, "0");

  return `EXP-${nextNumber}`;
}

export async function createPatientAction(
  _previousState: PatientFormState,
  formData: FormData,
): Promise<PatientFormState> {
  const payload = readPatientPayload(formData);
  const validationError = validatePatientPayload(payload);

  if (validationError) {
    return { error: validationError };
  }

  const pool = getPool();
  const numeroExpediente = payload.numeroExpediente || await generateNextExpedientNumber();

  try {
    await pool.query(
      `
        insert into pacientes (
          numero_expediente,
          nombre,
          apellido_1,
          apellido_2,
          fecha_nacimiento,
          genero,
          telefono,
          email,
          direccion,
          contacto_emergencia_nombre,
          contacto_emergencia_telefono,
          activo
        )
        values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,true)
      `,
      [
        numeroExpediente,
        payload.nombre,
        payload.apellido1,
        payload.apellido2 || null,
        payload.fechaNacimiento,
        payload.genero || null,
        payload.telefono || null,
        payload.email || null,
        payload.direccion || null,
        payload.contactoEmergenciaNombre || null,
        payload.contactoEmergenciaTelefono || null,
      ],
    );
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("numero_expediente")
        ? "Ya existe un paciente con ese numero de expediente."
        : "No se pudo crear el paciente. Revisa los datos e intenta de nuevo.";

    return { error: message };
  }

  revalidatePath("/pacientes");
  redirect("/pacientes");
}

export async function updatePatientAction(
  patientId: string,
  _previousState: PatientFormState,
  formData: FormData,
): Promise<PatientFormState> {
  const payload = readPatientPayload(formData);

  if (!payload.numeroExpediente) {
    return { error: "Debes indicar el numero de expediente para editar el paciente." };
  }

  const validationError = validatePatientPayload(payload);

  if (validationError) {
    return { error: validationError };
  }

  const pool = getPool();

  try {
    await pool.query(
      `
        update pacientes
        set
          numero_expediente = $2,
          nombre = $3,
          apellido_1 = $4,
          apellido_2 = $5,
          fecha_nacimiento = $6,
          genero = $7,
          telefono = $8,
          email = $9,
          direccion = $10,
          contacto_emergencia_nombre = $11,
          contacto_emergencia_telefono = $12
        where id = $1
      `,
      [
        patientId,
        payload.numeroExpediente,
        payload.nombre,
        payload.apellido1,
        payload.apellido2 || null,
        payload.fechaNacimiento,
        payload.genero || null,
        payload.telefono || null,
        payload.email || null,
        payload.direccion || null,
        payload.contactoEmergenciaNombre || null,
        payload.contactoEmergenciaTelefono || null,
      ],
    );
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("numero_expediente")
        ? "Ese numero de expediente ya esta asignado a otro paciente."
        : "No se pudo actualizar el paciente.";

    return { error: message };
  }

  revalidatePath("/pacientes");
  revalidatePath(`/pacientes/${patientId}`);
  redirect(`/pacientes/${patientId}`);
}

export async function deactivatePatientAction(patientId: string) {
  const pool = getPool();

  await pool.query(
    `
      update pacientes
      set activo = false
      where id = $1
    `,
    [patientId],
  );

  revalidatePath("/pacientes");
  redirect("/pacientes");
}
