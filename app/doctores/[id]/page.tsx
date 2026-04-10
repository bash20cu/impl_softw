import Link from "next/link";
import { ArrowLeft, CalendarDays, Mail, Pencil, Phone, Stethoscope, Trash2 } from "lucide-react";
import { notFound } from "next/navigation";

import { requireSession } from "@/lib/auth";
import { deactivateDoctorAction } from "@/lib/doctor-actions";
import { getDoctorDetail } from "@/lib/doctors";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type DoctorDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DoctorDetailPage({ params }: DoctorDetailPageProps) {
  await requireSession();
  const { id } = await params;
  const doctor = await getDoctorDetail(id);

  if (!doctor) {
    notFound();
  }

  return (
    <main className="app-shell pb-10">
      <SiteHeader current="doctores" />

      <section className="px-4 pb-8 pt-8 md:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-full px-5" variant="outline">
              <Link href="/doctores">
                <ArrowLeft className="size-4" />
                Volver a doctores
              </Link>
            </Button>
            <Button asChild className="rounded-full px-5" variant="outline">
              <Link href={`/doctores/${doctor.id}/editar`}>
                <Pencil className="size-4" />
                Editar
              </Link>
            </Button>
            <form action={deactivateDoctorAction.bind(null, doctor.id)}>
              <Button className="rounded-full px-5" type="submit" variant="outline">
                <Trash2 className="size-4" />
                Desactivar
              </Button>
            </form>
          </div>

          <section className="rounded-[2rem] border border-border/70 bg-white/88 p-6 shadow-[0_18px_50px_rgba(17,33,31,0.08)] md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="space-y-3">
                <Badge variant="secondary">{doctor.codigoColegiado}</Badge>
                <h1 className="text-4xl font-semibold tracking-tight">{doctor.nombreCompleto}</h1>
                <div className="grid gap-2 text-sm text-muted-foreground">
                  <p className="inline-flex items-center gap-2">
                    <Stethoscope className="size-4 text-primary" />
                    Especialidad: {doctor.especialidad}
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <Mail className="size-4 text-primary" />
                    Correo: {doctor.email}
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <Phone className="size-4 text-primary" />
                    Telefono: {doctor.telefono}
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <CalendarDays className="size-4 text-primary" />
                    Fecha de contratacion: {doctor.fechaContratacion}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <article className="rounded-[1.3rem] border border-border/70 bg-muted/40 p-4 text-center">
                  <p className="text-sm text-muted-foreground">Citas</p>
                  <p className="mt-2 text-3xl font-semibold">{doctor.citasRegistradas}</p>
                </article>
                <article className="rounded-[1.3rem] border border-border/70 bg-muted/40 p-4 text-center">
                  <p className="text-sm text-muted-foreground">Expedientes</p>
                  <p className="mt-2 text-3xl font-semibold">{doctor.expedientesRegistrados}</p>
                </article>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
