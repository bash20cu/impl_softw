import Link from "next/link";
import { ArrowLeft, CalendarDays, FileText, Pencil, Stethoscope } from "lucide-react";
import { notFound } from "next/navigation";

import { requireSession } from "@/lib/auth";
import { getMedicalRecordDetail } from "@/lib/medical-records";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type MedicalRecordDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function MedicalRecordDetailPage({
  params,
}: MedicalRecordDetailPageProps) {
  await requireSession();
  const { id } = await params;
  const record = await getMedicalRecordDetail(id);

  if (!record) {
    notFound();
  }

  return (
    <main className="app-shell pb-10">
      <SiteHeader current="expedientes" />

      <section className="px-4 pb-8 pt-8 md:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-lg px-5" variant="outline">
              <Link href={`/expedientes?pacienteId=${record.pacienteId}`}>
                <ArrowLeft className="size-4" />
                Volver al historial
              </Link>
            </Button>
            <Button asChild className="rounded-lg px-5" variant="outline">
              <Link href={`/expedientes/${record.id}/editar`}>
                <Pencil className="size-4" />
                Editar
              </Link>
            </Button>
          </div>

          <section className="hero-panel">
            <div className="space-y-3">
              <Badge variant="secondary">{record.numeroExpediente}</Badge>
              <h1 className="text-4xl font-semibold tracking-tight">{record.paciente}</h1>
              <div className="grid gap-2 text-sm text-muted-foreground">
                <p className="inline-flex items-center gap-2">
                  <Stethoscope className="size-4 text-primary" />
                  Doctor: {record.doctor} ({record.doctorCodigo})
                </p>
                <p className="inline-flex items-center gap-2">
                  <CalendarDays className="size-4 text-primary" />
                  Fecha de cita: {record.fechaCita}
                </p>
                <p className="inline-flex items-center gap-2">
                  <FileText className="size-4 text-primary" />
                  Fecha de registro: {record.fechaRegistro}
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <article className="panel-card">
              <h2 className="text-lg font-semibold">Diagnostico</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{record.diagnostico}</p>
            </article>

            <article className="panel-card">
              <h2 className="text-lg font-semibold">Sintomas</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{record.sintomas || "-"}</p>
            </article>

            <article className="panel-card">
              <h2 className="text-lg font-semibold">Tratamiento</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{record.tratamiento || "-"}</p>
            </article>

            <article className="panel-card">
              <h2 className="text-lg font-semibold">Notas</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{record.notas || "-"}</p>
            </article>
          </section>
        </div>
      </section>
    </main>
  );
}
