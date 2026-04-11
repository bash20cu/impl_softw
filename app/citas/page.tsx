import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, Plus } from "lucide-react";

import { requireSession } from "@/lib/auth";
import { getAppointmentsList } from "@/lib/appointments";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage() {
  await requireSession();
  const appointments = await getAppointmentsList();

  return (
    <main className="app-shell pb-10">
      <SiteHeader current="citas" />

      <section className="page-frame">
        <div className="page-stack">
          <section className="hero-panel">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-3">
                <Badge variant="secondary">Modulo de citas</Badge>
                <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
                  Agenda clinica conectada a pacientes, doctores y consultorios
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                  Este modulo ya permite revisar las citas del sistema, crear nuevas,
                  editar informacion y cancelar cuando haga falta.
                </p>
              </div>

              <div className="flex flex-col gap-3 md:items-end">
                <div className="info-pill text-sm">
                  <p className="font-medium text-primary">{appointments.length} cita(s) registradas</p>
                  <p className="mt-1 text-muted-foreground">Vista viva desde la base de datos.</p>
                </div>
                <Button asChild className="rounded-lg px-5">
                  <Link href="/citas/nuevo">
                    <Plus className="size-4" />
                    Nueva cita
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          <section className="grid gap-4">
            {appointments.map((appointment) => (
              <article
                className="list-card"
                key={appointment.id}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="outline">{appointment.estado}</Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="size-4 text-primary" />
                        {appointment.fecha}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock3 className="size-4 text-primary" />
                        {appointment.horaInicio} - {appointment.horaFin}
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">
                        {appointment.paciente} · {appointment.pacienteExpediente}
                      </h2>
                      <div className="mt-2 flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:flex-wrap md:items-center md:gap-4">
                        <span>Doctor: {appointment.doctor}</span>
                        <span>Codigo: {appointment.doctorCodigo}</span>
                        <span>Consultorio: {appointment.consultorio}</span>
                        <span>Motivo: {appointment.motivo}</span>
                      </div>
                    </div>
                  </div>

                  <Button asChild className="rounded-lg px-5">
                    <Link href={`/citas/${appointment.id}`}>
                      Ver detalle
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}
