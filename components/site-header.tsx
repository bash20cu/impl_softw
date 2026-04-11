import Link from "next/link";
import {
  Activity,
  Settings2,
  Building2,
  FileText,
  HeartPulse,
  LayoutDashboard,
  Pill,
  ReceiptText,
  Stethoscope,
  Users,
} from "lucide-react";

import { canAccessPath } from "@/lib/access-control";
import { logoutAction } from "@/lib/auth-actions";
import { getCurrentSession } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type SiteHeaderProps = {
  current?:
    | "inicio"
    | "login"
    | "dashboard"
    | "reportes"
    | "pacientes"
    | "citas"
    | "doctores"
    | "expedientes"
    | "facturas"
    | "especialidades"
    | "medicamentos"
    | "consultorios"
    | "recetas"
    | "usuarios-admin";
};

const navSections: Array<{
  title: string;
  items: Array<{
    href: string;
    label: string;
    key: SiteHeaderProps["current"];
    icon: React.ComponentType<{ className?: string }>;
  }>;
}> = [
  {
    title: "Principal",
    items: [
      { href: "/dashboard", label: "Dashboard", key: "dashboard", icon: LayoutDashboard },
      { href: "/reportes", label: "Reportes", key: "reportes", icon: Activity },
    ],
  },
  {
    title: "Clinica",
    items: [
      { href: "/pacientes", label: "Pacientes", key: "pacientes", icon: Users },
      { href: "/doctores", label: "Doctores", key: "doctores", icon: Stethoscope },
      { href: "/citas", label: "Citas", key: "citas", icon: HeartPulse },
      { href: "/expedientes", label: "Expedientes", key: "expedientes", icon: FileText },
      { href: "/recetas", label: "Recetas", key: "recetas", icon: FileText },
    ],
  },
  {
    title: "Administracion",
    items: [
      { href: "/facturas", label: "Facturas", key: "facturas", icon: ReceiptText },
      { href: "/admin/usuarios", label: "Usuarios", key: "usuarios-admin", icon: Settings2 },
      { href: "/especialidades", label: "Especialidades", key: "especialidades", icon: Stethoscope },
      { href: "/medicamentos", label: "Medicamentos", key: "medicamentos", icon: Pill },
      { href: "/consultorios", label: "Consultorios", key: "consultorios", icon: Building2 },
    ],
  },
];

export async function SiteHeader({ current }: SiteHeaderProps) {
  const session = await getCurrentSession();
  const visibleSections = session
    ? navSections
        .map((section) => ({
          ...section,
          items: section.items.filter((item) => canAccessPath(item.href, session.role)),
        }))
        .filter((section) => section.items.length > 0)
    : [];

  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-[linear-gradient(180deg,rgba(250,251,249,0.96),rgba(250,251,249,0.82))] backdrop-blur-xl">
      <div className="mx-auto flex w-[min(1240px,calc(100%-2rem))] flex-col gap-4 px-2 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link
            className="group flex min-w-0 items-center gap-3 rounded-lg border border-transparent px-3 py-2 transition-colors hover:border-white/80 hover:bg-white/70"
            href="/"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-[linear-gradient(180deg,#0f766e,#115e59)] text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.26)]">
              CP
            </span>
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold tracking-tight text-slate-900">
                ClinicaPlus
              </p>
              <p className="truncate text-xs text-muted-foreground">
                Espacio operativo para clinica y administracion
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-3 lg:flex">
            <Badge
              className="rounded-xl border-slate-200 bg-white/82 px-3 py-1.5 text-slate-700"
              variant="outline"
            >
              Next.js + PostgreSQL + Vercel
            </Badge>

            {session ? (
              <>
                <div className="rounded-lg border border-white/80 bg-white/78 px-4 py-2 text-right shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
                  <p className="text-sm font-semibold leading-none text-slate-900">
                    {session.name}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    {session.role}
                  </p>
                </div>
                <form action={logoutAction}>
                  <Button
                    className="rounded-lg border-slate-200 bg-white/82 px-4 text-slate-700 shadow-none hover:bg-white"
                    size="sm"
                    type="submit"
                    variant="outline"
                  >
                    Cerrar sesion
                  </Button>
                </form>
              </>
            ) : (
              <Button asChild className="rounded-lg px-4" size="sm">
                <Link href="/login">Iniciar sesion</Link>
              </Button>
            )}
          </div>
        </div>

        {session ? (
          <nav className="hidden rounded-xl border border-white/75 bg-white/72 p-2 shadow-[0_10px_24px_rgba(15,23,42,0.045)] md:block">
            <div className={`grid gap-2 ${visibleSections.length > 2 ? "xl:grid-cols-3" : "xl:grid-cols-2"}`}>
              {visibleSections.map((section) => (
              <section
                className="rounded-lg border border-transparent bg-[linear-gradient(180deg,rgba(255,255,255,0.56),rgba(255,255,255,0.22))] p-2"
                key={section.title}
              >
                <div className="px-2 pb-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {section.title}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {section.items.map((item) => {
                    const active = current === item.key;
                    const Icon = item.icon;

                    return (
                      <Link
                        className={[
                          "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          active
                            ? "border border-teal-200 bg-[linear-gradient(180deg,rgba(15,118,110,0.12),rgba(255,255,255,0.96))] text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)]"
                            : "border border-transparent text-slate-600 hover:border-slate-200 hover:bg-white hover:text-slate-900",
                        ].join(" ")}
                        href={item.href}
                        key={item.href}
                      >
                        <Icon className={active ? "size-4 text-primary" : "size-4 text-slate-400"} />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </section>
              ))}
            </div>
          </nav>
        ) : null}

        <div className="flex items-center justify-between gap-3 rounded-lg border border-white/75 bg-white/72 px-3 py-2 shadow-[0_8px_18px_rgba(15,23,42,0.04)] md:hidden">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {session ? session.name : "ClinicaPlus"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {session ? session.role : "Inicia sesion para abrir los modulos"}
            </p>
          </div>

          {session ? (
            <form action={logoutAction}>
              <Button className="rounded-lg" size="sm" type="submit" variant="outline">
                Salir
              </Button>
            </form>
          ) : (
            <Button asChild className="rounded-lg" size="sm">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
