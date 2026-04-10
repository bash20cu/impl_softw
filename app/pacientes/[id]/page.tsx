import Link from "next/link";
import { ArrowLeft, CreditCard, FileText, Pencil, Phone, Trash2, UserRound } from "lucide-react";
import { notFound } from "next/navigation";

import { requireSession } from "@/lib/auth";
import { deactivatePatientAction } from "@/lib/patient-actions";
import { getPatientDetail } from "@/lib/patients";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type PatientDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PatientDetailPage({ params }: PatientDetailPageProps) {
  await requireSession();
  const { id } = await params;
  const patient = await getPatientDetail(id);

  if (!patient) {
    notFound();
  }

  return (
    <main className="app-shell pb-10">
      <SiteHeader current="pacientes" />

      <section className="px-4 pb-8 pt-8 md:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-3">
              <Button asChild className="rounded-full px-5" variant="outline">
                <Link href="/pacientes">
                  <ArrowLeft className="size-4" />
                  Volver a pacientes
                </Link>
              </Button>
              <Button asChild className="rounded-full px-5" variant="outline">
                <Link href={`/expedientes?pacienteId=${patient.id}`}>
                  <FileText className="size-4" />
                  Ver expedientes
                </Link>
              </Button>
              <Button asChild className="rounded-full px-5" variant="outline">
                <Link href={`/pacientes/${patient.id}/editar`}>
                  <Pencil className="size-4" />
                  Editar
                </Link>
              </Button>
              <form action={deactivatePatientAction.bind(null, patient.id)}>
                <Button className="rounded-full px-5" type="submit" variant="outline">
                  <Trash2 className="size-4" />
                  Desactivar
                </Button>
              </form>
            </div>
          </div>

          <section className="rounded-[2rem] border border-border/70 bg-white/88 p-6 shadow-[0_18px_50px_rgba(17,33,31,0.08)] md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="space-y-3">
                <Badge variant="secondary">{patient.numeroExpediente}</Badge>
                <h1 className="text-4xl font-semibold tracking-tight">{patient.nombreCompleto}</h1>
                <div className="grid gap-2 text-sm text-muted-foreground">
                  <p className="inline-flex items-center gap-2">
                    <UserRound className="size-4 text-primary" />
                    Genero: {patient.genero}
                  </p>
                  <p>Fecha de nacimiento: {patient.fechaNacimiento}</p>
                  <p className="inline-flex items-center gap-2">
                    <Phone className="size-4 text-primary" />
                    Telefono: {patient.telefono}
                  </p>
                  <p>Correo: {patient.email}</p>
                  <p>Contacto de emergencia: {patient.contactoEmergencia}</p>
                  <p>Telefono de emergencia: {patient.contactoEmergenciaTelefono}</p>
                  <p>Direccion: {patient.direccion}</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <article className="rounded-[1.3rem] border border-border/70 bg-muted/40 p-4 text-center">
                  <p className="text-sm text-muted-foreground">Citas</p>
                  <p className="mt-2 text-3xl font-semibold">{patient.citasRegistradas}</p>
                </article>
                <article className="rounded-[1.3rem] border border-border/70 bg-muted/40 p-4 text-center">
                  <p className="text-sm text-muted-foreground">Expedientes</p>
                  <p className="mt-2 text-3xl font-semibold">{patient.expedientesRegistrados}</p>
                </article>
                <article className="rounded-[1.3rem] border border-border/70 bg-muted/40 p-4 text-center">
                  <p className="text-sm text-muted-foreground">Facturas</p>
                  <p className="mt-2 text-3xl font-semibold">{patient.facturasRegistradas}</p>
                </article>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <article className="rounded-[1.6rem] border border-border/70 bg-white/82 p-5 shadow-[0_12px_35px_rgba(17,33,31,0.05)]">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <FileText className="size-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Contexto clinico</h2>
                  <p className="text-sm text-muted-foreground">
                    Base preparada para enlazar historial, diagnosticos y recetas.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-[1.6rem] border border-border/70 bg-white/82 p-5 shadow-[0_12px_35px_rgba(17,33,31,0.05)]">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <CreditCard className="size-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Contexto administrativo</h2>
                  <p className="text-sm text-muted-foreground">
                    Base preparada para enlazar facturacion, pagos y futuros reportes por paciente.
                  </p>
                </div>
              </div>
            </article>
          </section>
        </div>
      </section>
    </main>
  );
}
