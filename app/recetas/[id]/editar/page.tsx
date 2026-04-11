import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { getPrescriptionById, getPrescriptionFormOptions } from "@/lib/prescriptions";
import { requireSession } from "@/lib/auth";
import { PrescriptionForm } from "@/components/prescriptions/prescription-form";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

type EditPrescriptionPageProps = { params: Promise<{ id: string }> };

export default async function EditPrescriptionPage({ params }: EditPrescriptionPageProps) {
  await requireSession();
  const { id } = await params;
  const [prescription, options] = await Promise.all([
    getPrescriptionById(id),
    getPrescriptionFormOptions(),
  ]);

  if (!prescription) {
    notFound();
  }

  return (
    <main className="app-shell pb-10">
      <SiteHeader />
      <section className="px-4 pb-8 pt-8 md:px-8 lg:px-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <Button asChild className="rounded-lg px-5" variant="outline">
            <Link href={`/recetas/${prescription.id}`}>
              <ArrowLeft className="size-4" />
              Volver al detalle
            </Link>
          </Button>
          <section className="panel-card">
            <PrescriptionForm
              defaultValues={{
                expedienteId: prescription.expedienteId,
                medicamentoId: prescription.medicamentoId,
                dosis: prescription.dosis,
                frecuencia: prescription.frecuencia,
                duracion: prescription.duracion,
                indicaciones: prescription.indicaciones,
              }}
              medicines={options.medicines}
              mode="edit"
              prescriptionId={prescription.id}
              records={options.records}
            />
          </section>
        </div>
      </section>
    </main>
  );
}
