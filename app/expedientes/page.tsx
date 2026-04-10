import Link from "next/link";
import { ArrowRight, FileText, Plus, Stethoscope } from "lucide-react";

import { requireSession } from "@/lib/auth";
import { getMedicalRecordsList } from "@/lib/medical-records";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type MedicalRecordsPageProps = {
  searchParams?: Promise<{ pacienteId?: string }>;
};

export default async function MedicalRecordsPage({ searchParams }: MedicalRecordsPageProps) {
  await requireSession();
  const resolvedSearchParams = (await searchParams) ?? {};
  const patientId = resolvedSearchParams.pacienteId;
  const records = await getMedicalRecordsList(patientId);

  return (
    <main className="app-shell pb-10">
      <SiteHeader current="expedientes" />

      <section className="px-4 pb-8 pt-8 md:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="rounded-[2rem] border border-border/70 bg-white/85 p-6 shadow-[0_18px_50px_rgba(17,33,31,0.08)] md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-3">
                <Badge variant="secondary">Modulo de expedientes</Badge>
                <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
                  Historial clinico listo para citas, pacientes y seguimiento
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                  Aqui puedes revisar los expedientes existentes, abrir su detalle y registrar
                  nuevos hallazgos clinicos desde una cita o directamente desde el historial del paciente.
                </p>
              </div>

              <div className="flex flex-col gap-3 md:items-end">
                <div className="rounded-[1.4rem] border border-primary/20 bg-primary/[0.05] px-4 py-3 text-sm">
                  <p className="font-medium text-primary">{records.length} expediente(s) encontrados</p>
                  <p className="mt-1 text-muted-foreground">
                    {patientId ? "Filtrado por paciente." : "Vista general del historial clinico."}
                  </p>
                </div>
                <Button asChild className="rounded-full px-5">
                  <Link href={patientId ? `/expedientes/nuevo?pacienteId=${patientId}` : "/expedientes/nuevo"}>
                    <Plus className="size-4" />
                    Nuevo expediente
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          <section className="grid gap-4">
            {records.map((record) => (
              <article
                className="rounded-[1.7rem] border border-border/70 bg-white/88 p-5 shadow-[0_12px_35px_rgba(17,33,31,0.05)]"
                key={record.id}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="outline">{record.numeroExpediente}</Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="size-4 text-primary" />
                        Registro: {record.fechaRegistro}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Stethoscope className="size-4 text-primary" />
                        Cita: {record.fechaCita}
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{record.paciente}</h2>
                      <div className="mt-2 flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:flex-wrap md:items-center md:gap-4">
                        <span>Doctor: {record.doctor}</span>
                        <span>Codigo: {record.doctorCodigo}</span>
                        <span>Diagnostico: {record.diagnostico}</span>
                      </div>
                    </div>
                  </div>

                  <Button asChild className="rounded-full px-5">
                    <Link href={`/expedientes/${record.id}`}>
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
