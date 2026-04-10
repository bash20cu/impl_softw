import type { AppRole } from "@/lib/auth-shared";

const publicPrefixes = ["/", "/login"];

const protectedRouteRules: Array<{
  prefixes: string[];
  roles: AppRole[];
}> = [
  {
    prefixes: ["/dashboard"],
    roles: ["admin", "recepcionista", "doctor"],
  },
  {
    prefixes: ["/pacientes", "/citas"],
    roles: ["admin", "recepcionista", "doctor"],
  },
  {
    prefixes: ["/expedientes", "/recetas"],
    roles: ["admin", "doctor"],
  },
  {
    prefixes: ["/facturas", "/reportes"],
    roles: ["admin", "recepcionista"],
  },
  {
    prefixes: ["/doctores", "/especialidades", "/medicamentos", "/consultorios"],
    roles: ["admin"],
  },
  {
    prefixes: ["/admin"],
    roles: ["admin"],
  },
];

function normalizePathname(pathname: string) {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

function matchesPrefix(pathname: string, prefix: string) {
  if (prefix === "/") {
    return pathname === "/";
  }

  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isPublicPath(pathname: string) {
  const normalized = normalizePathname(pathname);
  return publicPrefixes.some((prefix) => matchesPrefix(normalized, prefix));
}

export function canAccessPath(pathname: string, role?: string | null) {
  const normalized = normalizePathname(pathname);

  if (isPublicPath(normalized)) {
    return true;
  }

  if (!role) {
    return false;
  }

  const matchedRule = protectedRouteRules.find((rule) =>
    rule.prefixes.some((prefix) => matchesPrefix(normalized, prefix)),
  );

  if (!matchedRule) {
    return true;
  }

  return matchedRule.roles.includes(role as AppRole);
}
