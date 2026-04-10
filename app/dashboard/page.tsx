import {
  Activity,
  CalendarRange,
  CreditCard,
  FileSpreadsheet,
  HeartPulse,
  Stethoscope,
  UserSquare2,
} from "lucide-react";
import Link from "next/link";

import { requireSession } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { healthcheckDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

const quickStats = [
  { label: "Citas del dia", value: "18", icon: CalendarRange },
  { label: "Pacientes activos", value: "245", icon: UserSquare2 },
  { label: "Doctores activos", value: "9", icon: Stethoscope },
  { label: "Facturas pendientes", value: "7", icon: CreditCard },
];

const workAreas = [
  {
    title: "Pacientes",
    description: "Busqueda, historial, contacto de emergencia y seguimiento clinico.",
  },
  {
    title: "Agenda",
    description: "Turnos, estados de cita y distribucion por doctor y consultorio.",
  },
  {
    title: "Expedientes",
    description: "Diagnosticos, sintomas, tratamiento y notas medicas por consulta.",
  },
  {
    title: "Reportes",
    description: "Consultas administrativas y clinicas para la exposicion final.",
  },
];

export default async function DashboardPage() {
  const session = await requireSession();
  let databaseStatus = "Conexion pendiente";

  try {
    const result = await healthcheckDatabase();
    databaseStatus = `PostgreSQL activo: ${new Date(result.current_time).toLocaleString("es-CR")}`;
  } catch {
    databaseStatus = "No se pudo consultar la base de datos todavia";
  }

  return (
    <main className="app-shell pb-10">
      <SiteHeader current="dashboard" />

      <section className="px-4 pb-8 pt-8 md:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="grid gap-6 rounded-[2rem] border border-border/70 bg-white/85 p-6 shadow-[0_18px_50px_rgba(17,33,31,0.08)] lg:grid-cols-[1.1fr_0.9fr] md:p-8">
            <div className="space-y-5">
              <Badge variant="secondary">Dashboard SSR del monolito</Badge>
              <div className="space-y-4">
                <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
                  La superficie operativa ya tiene mejor jerarquia y mejor lectura.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                  En un sistema interno conviene priorizar orientacion, estado y
                  accion. Por eso esta pantalla baja el tono de marketing y sube la
                  claridad del producto.
                </p>
                <p className="text-sm font-medium text-primary">
                  Sesion activa: {session.name} ({session.role})
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button className="rounded-full px-5">Crear cita</Button>
                <Button asChild className="rounded-full px-5" variant="outline">
                  <Link href="/pacientes">Ver pacientes</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-primary/15 bg-[linear-gradient(180deg,rgba(15,118,110,0.08),rgba(255,255,255,0.8))] p-5">
              <div className="flex items-start gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  <Activity className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">Estado del backend</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {databaseStatus}
                  </p>
                </div>
              </div>

              <Separator className="my-5" />

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-[1.2rem] border border-border/70 bg-white/85 px-4 py-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Arquitectura</p>
                    <p className="font-semibold">Monolito SSR simple</p>
                  </div>
                  <HeartPulse className="size-5 text-primary" />
                </div>
                <div className="flex items-center justify-between rounded-[1.2rem] border border-border/70 bg-white/85 px-4 py-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Reportes previstos</p>
                    <p className="font-semibold">2 reportes relacionales</p>
                  </div>
                  <FileSpreadsheet className="size-5 text-primary" />
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {quickStats.map((stat) => {
              const Icon = stat.icon;

              return (
                <article
                  className="rounded-[1.6rem] border border-border/70 bg-white/82 p-5 shadow-[0_12px_35px_rgba(17,33,31,0.05)]"
                  key={stat.label}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </div>
                  </div>
                  <p className="mt-4 text-4xl font-semibold tracking-tight">{stat.value}</p>
                </article>
              );
            })}
          </section>

          <section className="rounded-[2rem] border border-border/70 bg-white/82 p-6 shadow-[0_18px_50px_rgba(17,33,31,0.06)] md:p-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <Badge variant="outline">Backoffice de ClinicaPlus</Badge>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  Areas listas para seguir desarrollando
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                La siguiente mejora funcional es conectar cada area con consultas SQL reales y datos de ejemplo.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {workAreas.map((area) => (
                <article
                  className="rounded-[1.4rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(244,246,242,0.85))] p-5"
                  key={area.title}
                >
                  <h3 className="text-lg font-semibold">{area.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {area.description}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
