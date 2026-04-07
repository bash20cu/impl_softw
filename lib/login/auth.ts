"use server";

import { cookies } from "next/headers";
import { getPool } from "@/lib/db";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Invalid email format." };
  }

  try {
    const pool = getPool();
    const query = `
      SELECT u.id, u.email, u.password_hash, u.activo, r.nombre as rol_nombre
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      WHERE u.email = $1
    `;
    const result = await pool.query(query, [email]);
    const user = result.rows[0];

    if (!user) {
      return { error: "Invalid credentials." };
    }

    if (!user.activo) {
      return { error: "This user account is inactive." };
    }

    if (password !== user.password_hash) {
      return { error: "Invalid credentials." };
    }

    const cookieStore = await cookies();
    cookieStore.set("session", JSON.stringify({ 
      userId: user.id, 
      role: user.rol_nombre, 
      email: user.email 
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

  } catch (err) {
    return { error: "Internal server error. Please try again." };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/login");
}

export async function getValidSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) {
    redirect("/login");
  }

  return JSON.parse(sessionCookie.value);
}