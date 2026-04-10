import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { requireSession } from "@/lib/auth";
import { getMedicalRecordDetail, getMedicalRecordFormOptions } from "@/lib/medical-records";
import { MedicalRecordForm } from "@/components/medical-records/medical-record-form";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

type EditMedicalRecordPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditMedicalRecordPage({
  params,
}: EditMedicalRecordPageProps) {
  await requireSession();
  const { id } = await params;
  const [record, options] = await Promise.all([
    getMedicalRecordDetail(id),
    getMedicalRecordFormOptions(),
  ]);

  if (!record) {
    notFound();
  }

  return (
    <main className="app-shell pb-10">
      <SiteHeader current="expedientes" />

      <section className="px-4 pb-8 pt-8 md:px-8 lg:px-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <Button asChild className="rounded-full px-5" variant="outline">
            <Link href={`/expedientes/${record.id}`}>
              <ArrowLeft className="size-4" />
              Volver al detalle
            </Link>
          </Button>

          <section className="rounded-[2rem] border border-border/70 bg-white/88 p-6 shadow-[0_18px_50px_rgba(17,33,31,0.08)] md:p-8">
            <MedicalRecordForm
              appointments={record.citaId ? [{ id: record.citaId, label: `${record.numeroExpediente} · ${record.paciente}`, helper: `${record.fechaCita} · ${record.doctorCodigo} ${record.doctor}` }, ...options.appointments] : options.appointments}
              defaultValues={{
                pacienteId: record.pacienteId,
                citaId: record.citaId,
                doctorId: record.doctorId,
                diagnostico: record.diagnostico,
                sintomas: record.sintomas,
                tratamiento: record.tratamiento,
                notas: record.notas,
              }}
              doctors={options.doctors}
              mode="edit"
              patients={options.patients}
              recordId={record.id}
            />
          </section>
        </div>
      </section>
    </main>
  );
}
