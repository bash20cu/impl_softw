import Link from "next/link";
import { ArrowLeft, CalendarDays, CreditCard, FileText, Pencil, Stethoscope, Trash2 } from "lucide-react";
import { notFound } from "next/navigation";

import { cancelAppointmentAction } from "@/lib/appointment-actions";
import { requireSession } from "@/lib/auth";
import { getAppointmentDetail } from "@/lib/appointments";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type AppointmentDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AppointmentDetailPage({ params }: AppointmentDetailPageProps) {
  await requireSession();
  const { id } = await params;
  const appointment = await getAppointmentDetail(id);

  if (!appointment) {
    notFound();
  }

  return (
    <main className="app-shell pb-10">
      <SiteHeader current="citas" />

      <section className="px-4 pb-8 pt-8 md:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-lg px-5" variant="outline">
              <Link href="/citas">
                <ArrowLeft className="size-4" />
                Volver a citas
              </Link>
            </Button>
            <Button asChild className="rounded-lg px-5" variant="outline">
              <Link href={`/expedientes/nuevo?citaId=${appointment.id}`}>
                <FileText className="size-4" />
                Crear expediente
              </Link>
            </Button>
            <Button asChild className="rounded-lg px-5" variant="outline">
              <Link href={`/facturas/nuevo?citaId=${appointment.id}`}>
                <CreditCard className="size-4" />
                Crear factura
              </Link>
            </Button>
            <Button asChild className="rounded-lg px-5" variant="outline">
              <Link href={`/citas/${appointment.id}/editar`}>
                <Pencil className="size-4" />
                Editar
              </Link>
            </Button>
            <form action={cancelAppointmentAction.bind(null, appointment.id)}>
              <Button className="rounded-lg px-5" type="submit" variant="outline">
                <Trash2 className="size-4" />
                Cancelar cita
              </Button>
            </form>
          </div>

          <section className="hero-panel">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="space-y-3">
                <Badge variant="secondary">{appointment.estado}</Badge>
                <h1 className="text-4xl font-semibold tracking-tight">
                  {appointment.paciente} · {appointment.pacienteExpediente}
                </h1>
                <div className="grid gap-2 text-sm text-muted-foreground">
                  <p className="inline-flex items-center gap-2">
                    <CalendarDays className="size-4 text-primary" />
                    Fecha: {appointment.fecha}
                  </p>
                  <p>Horario: {appointment.horaInicio} - {appointment.horaFin}</p>
                  <p className="inline-flex items-center gap-2">
                    <Stethoscope className="size-4 text-primary" />
                    Doctor: {appointment.doctor} ({appointment.doctorCodigo})
                  </p>
                  <p>Consultorio: {appointment.consultorio}</p>
                  <p>Motivo: {appointment.motivo}</p>
                  <p>Observaciones: {appointment.observaciones || "-"}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
