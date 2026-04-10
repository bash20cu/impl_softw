"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getPool } from "@/lib/db";

export type CatalogFormState = {
  error: string | null;
};

function readCatalogPayload(formData: FormData) {
  return {
    nombre: String(formData.get("nombre") ?? "").trim(),
    descripcion: String(formData.get("descripcion") ?? "").trim(),
  };
}

function readMedicinePayload(formData: FormData) {
  return {
    nombre: String(formData.get("nombre") ?? "").trim(),
    presentacion: String(formData.get("presentacion") ?? "").trim(),
    descripcion: String(formData.get("descripcion") ?? "").trim(),
  };
}

function readOfficePayload(formData: FormData) {
  return {
    nombre: String(formData.get("nombre") ?? "").trim(),
    ubicacion: String(formData.get("ubicacion") ?? "").trim(),
    piso: String(formData.get("piso") ?? "").trim(),
    estado: String(formData.get("estado") ?? "").trim(),
  };
}

export async function createSpecialtyAction(
  _previousState: CatalogFormState,
  formData: FormData,
): Promise<CatalogFormState> {
  const payload = readCatalogPayload(formData);

  if (!payload.nombre) {
    return { error: "Debes indicar el nombre de la especialidad." };
  }

  const pool = getPool();

  try {
    await pool.query(
      `
        insert into especialidades (nombre, descripcion, activo)
        values ($1,$2,true)
      `,
      [payload.nombre, payload.descripcion || null],
    );
  } catch {
    return { error: "No se pudo crear la especialidad. Verifica si el nombre ya existe." };
  }

  revalidatePath("/especialidades");
  redirect("/especialidades");
}

export async function updateSpecialtyAction(
  specialtyId: string,
  _previousState: CatalogFormState,
  formData: FormData,
): Promise<CatalogFormState> {
  const payload = readCatalogPayload(formData);

  if (!payload.nombre) {
    return { error: "Debes indicar el nombre de la especialidad." };
  }

  const pool = getPool();

  try {
    await pool.query(
      `
        update especialidades
        set nombre = $2, descripcion = $3
        where id = $1
      `,
      [specialtyId, payload.nombre, payload.descripcion || null],
    );
  } catch {
    return { error: "No se pudo actualizar la especialidad." };
  }

  revalidatePath("/especialidades");
  redirect("/especialidades");
}

export async function deactivateSpecialtyAction(specialtyId: string) {
  const pool = getPool();
  await pool.query(
    `
      update especialidades
      set activo = false
      where id = $1
    `,
    [specialtyId],
  );
  revalidatePath("/especialidades");
  redirect("/especialidades");
}

export async function createMedicineAction(
  _previousState: CatalogFormState,
  formData: FormData,
): Promise<CatalogFormState> {
  const payload = readMedicinePayload(formData);

  if (!payload.nombre) {
    return { error: "Debes indicar el nombre del medicamento." };
  }

  const pool = getPool();

  try {
    await pool.query(
      `
        insert into medicamentos (nombre, presentacion, descripcion, activo)
        values ($1,$2,$3,true)
      `,
      [payload.nombre, payload.presentacion || null, payload.descripcion || null],
    );
  } catch {
    return { error: "No se pudo crear el medicamento. Verifica si el nombre ya existe." };
  }

  revalidatePath("/medicamentos");
  redirect("/medicamentos");
}

export async function updateMedicineAction(
  medicineId: string,
  _previousState: CatalogFormState,
  formData: FormData,
): Promise<CatalogFormState> {
  const payload = readMedicinePayload(formData);

  if (!payload.nombre) {
    return { error: "Debes indicar el nombre del medicamento." };
  }

  const pool = getPool();

  try {
    await pool.query(
      `
        update medicamentos
        set nombre = $2, presentacion = $3, descripcion = $4
        where id = $1
      `,
      [medicineId, payload.nombre, payload.presentacion || null, payload.descripcion || null],
    );
  } catch {
    return { error: "No se pudo actualizar el medicamento." };
  }

  revalidatePath("/medicamentos");
  redirect("/medicamentos");
}

export async function deactivateMedicineAction(medicineId: string) {
  const pool = getPool();
  await pool.query(
    `
      update medicamentos
      set activo = false
      where id = $1
    `,
    [medicineId],
  );
  revalidatePath("/medicamentos");
  redirect("/medicamentos");
}

export async function createOfficeAction(
  _previousState: CatalogFormState,
  formData: FormData,
): Promise<CatalogFormState> {
  const payload = readOfficePayload(formData);

  if (!payload.nombre) {
    return { error: "Debes indicar el nombre del consultorio." };
  }

  const pool = getPool();

  try {
    await pool.query(
      `
        insert into consultorios (nombre, ubicacion, piso, estado)
        values ($1,$2,$3,$4)
      `,
      [payload.nombre, payload.ubicacion || null, payload.piso || null, payload.estado || "disponible"],
    );
  } catch {
    return { error: "No se pudo crear el consultorio. Verifica si el nombre ya existe." };
  }

  revalidatePath("/consultorios");
  redirect("/consultorios");
}

export async function updateOfficeAction(
  officeId: string,
  _previousState: CatalogFormState,
  formData: FormData,
): Promise<CatalogFormState> {
  const payload = readOfficePayload(formData);

  if (!payload.nombre) {
    return { error: "Debes indicar el nombre del consultorio." };
  }

  const pool = getPool();

  try {
    await pool.query(
      `
        update consultorios
        set nombre = $2, ubicacion = $3, piso = $4, estado = $5
        where id = $1
      `,
      [officeId, payload.nombre, payload.ubicacion || null, payload.piso || null, payload.estado || "disponible"],
    );
  } catch {
    return { error: "No se pudo actualizar el consultorio." };
  }

  revalidatePath("/consultorios");
  redirect("/consultorios");
}
