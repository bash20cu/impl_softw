import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CalendarClock,
  CreditCard,
  FileHeart,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const modules = [
  {
    icon: Users,
    title: "Pacientes y expedientes",
    description: "Historia clinica centralizada y consulta rapida por paciente.",
  },
  {
    icon: CalendarClock,
    title: "Agenda medica",
    description: "Citas por doctor, consultorio, estado y rango de fechas.",
  },
  {
    icon: CreditCard,
    title: "Facturacion",
    description: "Pagos, facturas y saldos pendientes dentro del mismo sistema.",
  },
  {
    icon: FileHeart,
    title: "Reportes",
    description: "Vistas claras para exponer datos clinicos y administrativos.",
  },
];

export default function Home() {
  return (
    <main className="app-shell pb-10">
      <SiteHeader current="inicio" />

      <section className="px-4 pb-8 pt-8 md:px-8 lg:px-10">
        <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="space-y-6 py-10 md:py-16">
            <Badge className="rounded-md px-3 py-1 text-sm" variant="secondary">
              ClinicaPlus · Proyecto academico con Next.js, PostgreSQL y Vercel
            </Badge>
            <div className="space-y-5">
              <h1 className="section-title max-w-4xl font-semibold text-balance text-[clamp(3rem,7vw,6.2rem)] leading-[0.92]">
                Operacion clinica clara, ordenada y lista para crecer.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Disenamos una plataforma para una clinica pequena con agenda
                medica, expedientes, facturacion y reportes, todo dentro de un
                monolito SSR facil de desplegar y defender en clase.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild className="h-11 rounded-lg px-6 text-sm">
                <Link href="/login">
                  Entrar al sistema
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild className="h-11 rounded-lg px-6 text-sm" variant="outline">
                <Link href="/dashboard">Ver dashboard</Link>
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(238,244,241,0.92))] p-5 shadow-[0_10px_24px_rgba(17,33,31,0.06)]">
            <div className="grid gap-4">
              <div className="flex items-center justify-between rounded-lg border border-border/70 bg-white/90 p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Turnos del dia</p>
                  <p className="mt-1 text-3xl font-semibold">18</p>
                </div>
                <div className="rounded-lg bg-primary/10 p-3 text-primary">
                  <CalendarClock className="size-5" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <article className="rounded-lg border border-border/70 bg-white/80 p-4">
                  <p className="text-sm text-muted-foreground">Doctores activos</p>
                  <p className="mt-2 text-2xl font-semibold">9</p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Especialidades distribuidas para consulta general y seguimiento.
                  </p>
                </article>
                <article className="rounded-lg border border-border/70 bg-[linear-gradient(180deg,#134e4a,#0f766e)] p-4 text-white">
                  <p className="text-sm text-white/72">Seguridad</p>
                  <p className="mt-2 text-2xl font-semibold">3 roles</p>
                  <p className="mt-3 text-sm leading-6 text-white/78">
                    Administrador, recepcionista y doctor.
                  </p>
                </article>
              </div>

              <article className="rounded-lg border border-border/70 bg-white/85 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Base de datos</p>
                    <p className="mt-1 text-xl font-semibold">12 tablas relacionadas</p>
                  </div>
                  <Activity className="size-5 text-primary" />
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                  <div>Pacientes</div>
                  <div>Citas</div>
                  <div>Expedientes</div>
                  <div>Doctores</div>
                  <div>Facturas</div>
                  <div>Pagos</div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-6 md:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl rounded-xl border border-border/70 bg-white/70 p-6 shadow-[0_10px_24px_rgba(17,33,31,0.04)] md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <Badge variant="outline">Base funcional del sistema</Badge>
              <h2 className="text-3xl font-semibold tracking-tight">
                Un frontend mas claro empieza por estructura, no por efectos.
              </h2>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                En lugar de llenar la interfaz de tarjetas y bloques iguales,
                la composicion ahora separa mejor narrativa, accion, operacion y estado.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="size-4 text-primary" />
              shadcn/ui como base del sistema visual
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {modules.map((module) => {
              const Icon = module.icon;

              return (
                <article
                  className="rounded-lg border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(244,246,242,0.92))] p-5"
                  key={module.title}
                >
                  <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{module.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {module.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 pt-4 md:px-8 lg:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 rounded-xl border border-dashed border-primary/25 bg-primary/[0.045] p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Estado del equipo</p>
            <p className="mt-2 text-base text-muted-foreground">
              Login real, modulo de pacientes y datos de ejemplo ya estan listos para demostracion.
            </p>
          </div>
          <Button asChild className="rounded-lg px-6">
            <Link href="/dashboard">
              Continuar con el desarrollo
              <Stethoscope className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
