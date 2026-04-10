"use server";

import { redirect } from "next/navigation";

import { authenticateUser, clearSession, createSession } from "@/lib/auth";

export type LoginActionState = {
  error: string | null;
  email: string;
};

export async function loginAction(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!email || !password) {
    return {
      error: "Debes completar el correo y la contrasena.",
      email,
    };
  }

  const user = await authenticateUser({ email, password });

  if (!user) {
    return {
      error: "Credenciales invalidas. Revisa el correo y la contrasena demo.",
      email,
    };
  }

  await createSession({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
