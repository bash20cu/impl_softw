"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getPool } from "@/lib/db";

export type AdminUserFormState = {
  error: string | null;
};

function readUserPayload(formData: FormData) {
  return {
    nombre: String(formData.get("nombre") ?? "").trim(),
    apellido1: String(formData.get("apellido1") ?? "").trim(),
    apellido2: String(formData.get("apellido2") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    telefono: String(formData.get("telefono") ?? "").trim(),
    rol: String(formData.get("rol") ?? "").trim(),
  };
}

function readPasswordPayload(formData: FormData) {
  return {
    password: String(formData.get("password") ?? "").trim(),
  };
}

export async function updateAdminUserAction(
  userId: string,
  currentUserId: string,
  _previousState: AdminUserFormState,
  formData: FormData,
): Promise<AdminUserFormState> {
  const payload = readUserPayload(formData);

  if (!payload.nombre || !payload.apellido1 || !payload.email || !payload.rol) {
    return { error: "Debes completar nombre, primer apellido, correo y rol." };
  }

  if (userId === currentUserId && payload.rol !== "admin") {
    return { error: "No puedes quitarte el rol de administrador desde esta pantalla." };
  }

  const pool = getPool();

  try {
    await pool.query(
      `
        update usuarios
        set
          nombre = $2,
          apellido_1 = $3,
          apellido_2 = $4,
          email = $5,
          telefono = $6,
          rol_id = (select id from roles where nombre = $7 limit 1)
        where id = $1
      `,
      [
        userId,
        payload.nombre,
        payload.apellido1,
        payload.apellido2 || null,
        payload.email,
        payload.telefono || null,
        payload.rol,
      ],
    );
  } catch {
    return { error: "No se pudo actualizar el usuario. Verifica si el correo ya existe." };
  }

  revalidatePath("/admin/usuarios");
  revalidatePath(`/admin/usuarios/${userId}`);
  redirect(`/admin/usuarios/${userId}`);
}

export async function updateAdminUserPasswordAction(
  userId: string,
  _previousState: AdminUserFormState,
  formData: FormData,
): Promise<AdminUserFormState> {
  const payload = readPasswordPayload(formData);

  if (!payload.password) {
    return { error: "Debes indicar una nueva contrasena." };
  }

  const pool = getPool();
  await pool.query(
    `
      update usuarios
      set password_hash = $2
      where id = $1
    `,
    [userId, payload.password],
  );

  revalidatePath(`/admin/usuarios/${userId}`);
  redirect(`/admin/usuarios/${userId}`);
}

export async function toggleAdminUserAccessAction(
  userId: string,
  currentUserId: string,
  nextActive: boolean,
) {
  if (userId === currentUserId && !nextActive) {
    redirect(`/admin/usuarios/${userId}`);
  }

  const pool = getPool();
  await pool.query(
    `
      update usuarios
      set activo = $2
      where id = $1
    `,
    [userId, nextActive],
  );

  revalidatePath("/admin/usuarios");
  revalidatePath(`/admin/usuarios/${userId}`);
  redirect("/admin/usuarios");
}
