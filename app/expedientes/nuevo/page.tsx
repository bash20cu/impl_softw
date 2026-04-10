import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { requireSession } from "@/lib/auth";
import { getMedicalRecordFormOptions } from "@/lib/medical-records";
import { MedicalRecordForm } from "@/components/medical-records/medical-record-form";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

type NewMedicalRecordPageProps = {
  searchParams?: Promise<{ citaId?: string; pacienteId?: string }>;
};

export default async function NewMedicalRecordPage({
  searchParams,
}: NewMedicalRecordPageProps) {
  await requireSession();
  const resolvedSearchParams = (await searchParams) ?? {};
  const options = await getMedicalRecordFormOptions();

  return (
    <main className="app-shell pb-10">
      <SiteHeader current="expedientes" />

      <section className="px-4 pb-8 pt-8 md:px-8 lg:px-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <Button asChild className="rounded-full px-5" variant="outline">
            <Link href={resolvedSearchParams.pacienteId ? `/expedientes?pacienteId=${resolvedSearchParams.pacienteId}` : "/expedientes"}>
              <ArrowLeft className="size-4" />
              Volver a expedientes
            </Link>
          </Button>

          <section className="rounded-[2rem] border border-border/70 bg-white/88 p-6 shadow-[0_18px_50px_rgba(17,33,31,0.08)] md:p-8">
            <MedicalRecordForm
              appointments={options.appointments}
              defaultValues={{
                pacienteId: resolvedSearchParams.pacienteId ?? "",
                citaId: resolvedSearchParams.citaId ?? "",
                doctorId: "",
                diagnostico: "",
                sintomas: "",
                tratamiento: "",
                notas: "",
              }}
              doctors={options.doctors}
              mode="create"
              patients={options.patients}
            />
          </section>
        </div>
      </section>
    </main>
  );
}
