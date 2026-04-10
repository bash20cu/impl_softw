import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { findUserForAuth } from "@/lib/db";

const SESSION_COOKIE_NAME = "clinicaplus_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

type SessionPayload = {
  userId: string;
  email: string;
  role: string;
  name: string;
};

export type AuthSession = SessionPayload & {
  isAuthenticated: true;
};

function getSessionSecret() {
  return process.env.SESSION_SECRET ?? "clinicaplus-dev-secret-change-me";
}

function encodePayload(payload: SessionPayload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function signValue(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function createSessionToken(payload: SessionPayload) {
  const encodedPayload = encodePayload(payload);
  const signature = signValue(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

function decodeSessionToken(token: string) {
  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signValue(encodedPayload);
  const isValid =
    signature.length === expectedSignature.length &&
    timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));

  if (!isValid) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as SessionPayload;
  } catch {
    return null;
  }
}

function buildFullName(user: {
  nombre: string;
  apellido_1: string;
  apellido_2: string | null;
}) {
  return [user.nombre, user.apellido_1, user.apellido_2].filter(Boolean).join(" ");
}

function resolveRedirectByRole(role: string) {
  switch (role) {
    case "admin":
    case "recepcionista":
    case "doctor":
      return "/dashboard";
    default:
      return "/";
  }
}

function isPasswordValid(plainPassword: string, storedPasswordHash: string) {
  return plainPassword === storedPasswordHash;
}

export async function authenticateUser(credentials: {
  email: string;
  password: string;
}) {
  const user = await findUserForAuth(credentials.email);

  if (!user || !user.activo) {
    return null;
  }

  const matchesPassword = isPasswordValid(credentials.password, user.password_hash);

  if (!matchesPassword) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    role: user.rol_nombre,
    name: buildFullName(user),
  };
}

export async function createSession(payload: SessionPayload) {
  const cookieStore = await cookies();
  const token = createSessionToken(payload);

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const payload = decodeSessionToken(token);

  if (!payload) {
    return null;
  }

  return {
    ...payload,
    isAuthenticated: true,
  };
}

export async function requireSession() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function redirectIfAuthenticated() {
  const session = await getCurrentSession();

  if (session) {
    redirect(resolveRedirectByRole(session.role));
  }
}

export function getDemoCredentials() {
  return [
    { role: "Administrador", email: "admin@clinicaplus.com", password: "hash_admin_demo" },
    { role: "Recepcionista", email: "recepcion@clinicaplus.com", password: "hash_recepcion_demo" },
    { role: "Doctor", email: "carlos.vargas@clinicaplus.com", password: "hash_doctor_1_demo" },
    { role: "Doctora", email: "sofia.jimenez@clinicaplus.com", password: "hash_doctor_2_demo" },
  ];
}
