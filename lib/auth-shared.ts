export const SESSION_COOKIE_NAME = "clinicaplus_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

export type SessionPayload = {
  userId: string;
  email: string;
  role: "admin" | "recepcionista" | "doctor" | string;
  name: string;
};

export type AppRole = "admin" | "recepcionista" | "doctor";
