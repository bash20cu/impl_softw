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

      <section className="page-frame">
        <div className="page-stack">
          <section className="hero-panel grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="space-y-5">
              <span className="page-eyebrow">Centro operativo</span>
              <div className="space-y-4">
                <h1 className="page-title text-balance">Resumen del sistema y accesos clave</h1>
                <p className="page-subtitle">
                  Este tablero prioriza estado, accesos directos y visibilidad sobre las
                  areas activas de la clinica para empezar a trabajar sin friccion.
                </p>
                <p className="text-sm font-medium text-primary">
                  Sesion activa: {session.name} ({session.role})
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="rounded-lg px-5">
                  <Link href="/citas/nuevo">Crear cita</Link>
                </Button>
                <Button asChild className="rounded-lg px-5" variant="outline">
                  <Link href="/pacientes">Ver pacientes</Link>
                </Button>
                <Button asChild className="rounded-lg px-5" variant="outline">
                  <Link href="/doctores">Ver doctores</Link>
                </Button>
              </div>
            </div>

            <div className="panel-card border-primary/15 bg-[linear-gradient(180deg,rgba(15,118,110,0.06),rgba(255,255,255,0.94))]">
              <div className="flex items-start gap-3">
                <div className="flex size-11 items-center justify-center rounded-lg bg-primary/12 text-primary">
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
                <div className="metric-card flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Arquitectura</p>
                    <p className="font-semibold">Monolito SSR simple</p>
                  </div>
                  <HeartPulse className="size-5 text-primary" />
                </div>
                <div className="metric-card flex items-center justify-between">
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
                <article className="metric-card" key={stat.label}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </div>
                  </div>
                  <p className="mt-4 text-4xl font-semibold tracking-tight">{stat.value}</p>
                </article>
              );
            })}
          </section>

          <section className="hero-panel">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="page-eyebrow">Mapa del producto</span>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                  Modulos listos para operacion
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                El login, pacientes y datos demo ya estan integrados; esta vista resume los modulos que se pueden demostrar hoy.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {workAreas.map((area) => (
                <article className="panel-card bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,247,250,0.9))]" key={area.title}>
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
