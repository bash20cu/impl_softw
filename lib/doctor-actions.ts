"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getPool } from "@/lib/db";

export type DoctorFormState = {
  error: string | null;
};

type DoctorPayload = {
  codigoColegiado: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  email: string;
  password: string;
  telefono: string;
  especialidadId: string;
  fechaContratacion: string;
};

function readDoctorPayload(formData: FormData): DoctorPayload {
  return {
    codigoColegiado: String(formData.get("codigoColegiado") ?? "").trim(),
    nombre: String(formData.get("nombre") ?? "").trim(),
    apellido1: String(formData.get("apellido1") ?? "").trim(),
    apellido2: String(formData.get("apellido2") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? "").trim(),
    telefono: String(formData.get("telefono") ?? "").trim(),
    especialidadId: String(formData.get("especialidadId") ?? "").trim(),
    fechaContratacion: String(formData.get("fechaContratacion") ?? "").trim(),
  };
}

function validateDoctorPayload(payload: DoctorPayload, mode: "create" | "edit") {
  if (
    !payload.codigoColegiado ||
    !payload.nombre ||
    !payload.apellido1 ||
    !payload.email ||
    !payload.especialidadId
  ) {
    return "Debes completar codigo colegiado, nombre, primer apellido, correo y especialidad.";
  }

  if (!payload.email.includes("@")) {
    return "Debes ingresar un correo valido para el doctor.";
  }

  if (mode === "create" && !payload.password) {
    return "Debes indicar una contrasena inicial para el doctor.";
  }

  return null;
}

function resolveDoctorErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof Error)) {
    return fallback;
  }

  if (error.message.includes("usuarios_email_key")) {
    return "Ya existe un usuario con ese correo.";
  }

  if (error.message.includes("doctores_codigo_colegiado_key")) {
    return "Ese codigo colegiado ya pertenece a otro doctor.";
  }

  return fallback;
}

export async function createDoctorAction(
  _previousState: DoctorFormState,
  formData: FormData,
): Promise<DoctorFormState> {
  const payload = readDoctorPayload(formData);
  const validationError = validateDoctorPayload(payload, "create");

  if (validationError) {
    return { error: validationError };
  }

  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("begin");

    const userResult = await client.query<{ id: string }>(
      `
        insert into usuarios (
          rol_id,
          nombre,
          apellido_1,
          apellido_2,
          email,
          password_hash,
          telefono,
          activo
        )
        values (
          (select id from roles where nombre = 'doctor' limit 1),
          $1,$2,$3,$4,$5,$6,true
        )
        returning id
      `,
      [
        payload.nombre,
        payload.apellido1,
        payload.apellido2 || null,
        payload.email,
        payload.password,
        payload.telefono || null,
      ],
    );

    await client.query(
      `
        insert into doctores (
          usuario_id,
          especialidad_id,
          codigo_colegiado,
          fecha_contratacion
        )
        values ($1,$2,$3,$4)
      `,
      [
        userResult.rows[0].id,
        payload.especialidadId,
        payload.codigoColegiado,
        payload.fechaContratacion || null,
      ],
    );

    await client.query("commit");
  } catch (error) {
    await client.query("rollback");

    return {
      error: resolveDoctorErrorMessage(
        error,
        "No se pudo crear el doctor. Revisa los datos e intenta de nuevo.",
      ),
    };
  } finally {
    client.release();
  }

  revalidatePath("/doctores");
  revalidatePath("/citas");
  revalidatePath("/reportes");
  revalidatePath("/dashboard");
  redirect("/doctores");
}

export async function updateDoctorAction(
  doctorId: string,
  _previousState: DoctorFormState,
  formData: FormData,
): Promise<DoctorFormState> {
  const payload = readDoctorPayload(formData);
  const validationError = validateDoctorPayload(payload, "edit");

  if (validationError) {
    return { error: validationError };
  }

  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("begin");

    const doctorResult = await client.query<{ usuario_id: string }>(
      `
        select usuario_id
        from doctores
        where id = $1
        limit 1
      `,
      [doctorId],
    );

    const usuarioId = doctorResult.rows[0]?.usuario_id;

    if (!usuarioId) {
      await client.query("rollback");
      return { error: "No se encontro el doctor que intentas editar." };
    }

    if (payload.password) {
      await client.query(
        `
          update usuarios
          set
            nombre = $2,
            apellido_1 = $3,
            apellido_2 = $4,
            email = $5,
            password_hash = $6,
            telefono = $7
          where id = $1
        `,
        [
          usuarioId,
          payload.nombre,
          payload.apellido1,
          payload.apellido2 || null,
          payload.email,
          payload.password,
          payload.telefono || null,
        ],
      );
    } else {
      await client.query(
        `
          update usuarios
          set
            nombre = $2,
            apellido_1 = $3,
            apellido_2 = $4,
            email = $5,
            telefono = $6
          where id = $1
        `,
        [
          usuarioId,
          payload.nombre,
          payload.apellido1,
          payload.apellido2 || null,
          payload.email,
          payload.telefono || null,
        ],
      );
    }

    await client.query(
      `
        update doctores
        set
          especialidad_id = $2,
          codigo_colegiado = $3,
          fecha_contratacion = $4
        where id = $1
      `,
      [
        doctorId,
        payload.especialidadId,
        payload.codigoColegiado,
        payload.fechaContratacion || null,
      ],
    );

    await client.query("commit");
  } catch (error) {
    await client.query("rollback");

    return {
      error: resolveDoctorErrorMessage(
        error,
        "No se pudo actualizar el doctor. Revisa los datos e intenta de nuevo.",
      ),
    };
  } finally {
    client.release();
  }

  revalidatePath("/doctores");
  revalidatePath(`/doctores/${doctorId}`);
  revalidatePath("/citas");
  revalidatePath("/reportes");
  revalidatePath("/dashboard");
  redirect(`/doctores/${doctorId}`);
}

export async function deactivateDoctorAction(doctorId: string) {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("begin");

    const doctorResult = await client.query<{ usuario_id: string }>(
      `
        select usuario_id
        from doctores
        where id = $1
        limit 1
      `,
      [doctorId],
    );

    const usuarioId = doctorResult.rows[0]?.usuario_id;

    if (!usuarioId) {
      await client.query("rollback");
      redirect("/doctores");
    }

    await client.query(
      `
        update usuarios
        set activo = false
        where id = $1
      `,
      [usuarioId],
    );

    await client.query("commit");
  } catch {
    await client.query("rollback");
  } finally {
    client.release();
  }

  revalidatePath("/doctores");
  revalidatePath(`/doctores/${doctorId}`);
  revalidatePath("/citas");
  revalidatePath("/reportes");
  revalidatePath("/dashboard");
  redirect("/doctores");
}
