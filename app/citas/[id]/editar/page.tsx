import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { requireSession } from "@/lib/auth";
import { getAppointmentDetail, getAppointmentFormOptions } from "@/lib/appointments";
import { AppointmentForm } from "@/components/appointments/appointment-form";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

type EditAppointmentPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditAppointmentPage({ params }: EditAppointmentPageProps) {
  await requireSession();
  const { id } = await params;
  const [appointment, options] = await Promise.all([
    getAppointmentDetail(id),
    getAppointmentFormOptions(),
  ]);

  if (!appointment) {
    notFound();
  }

  return (
    <main className="app-shell pb-10">
      <SiteHeader current="citas" />

      <section className="px-4 pb-8 pt-8 md:px-8 lg:px-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <Button asChild className="rounded-lg px-5" variant="outline">
            <Link href={`/citas/${appointment.id}`}>
              <ArrowLeft className="size-4" />
              Volver al detalle
            </Link>
          </Button>

          <section className="hero-panel">
            <AppointmentForm
              appointmentId={appointment.id}
              defaultValues={{
                pacienteId: appointment.pacienteId,
                doctorId: appointment.doctorId,
                consultorioId: appointment.consultorioId,
                fecha: appointment.fecha,
                horaInicio: appointment.horaInicio,
                horaFin: appointment.horaFin,
                estado: appointment.estado,
                motivo: appointment.motivo === "-" ? "" : appointment.motivo,
                observaciones: appointment.observaciones,
              }}
              doctors={options.doctors}
              mode="edit"
              offices={options.offices}
              patients={options.patients}
            />
          </section>
        </div>
      </section>
    </main>
  );
}
