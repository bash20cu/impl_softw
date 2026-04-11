import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { getMedicineById } from "@/lib/admin-catalogs";
import { requireSession } from "@/lib/auth";
import { MedicineForm } from "@/components/admin/medicine-form";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

type EditMedicinePageProps = { params: Promise<{ id: string }> };

export default async function EditMedicinePage({ params }: EditMedicinePageProps) {
  await requireSession();
  const { id } = await params;
  const medicine = await getMedicineById(id);

  if (!medicine) {
    notFound();
  }

  return (
    <main className="app-shell pb-10">
      <SiteHeader />
      <section className="px-4 pb-8 pt-8 md:px-8 lg:px-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <Button asChild className="rounded-lg px-5" variant="outline">
            <Link href="/medicamentos">
              <ArrowLeft className="size-4" />
              Volver a medicamentos
            </Link>
          </Button>
          <section className="panel-card">
            <MedicineForm
              defaultValues={{
                nombre: medicine.nombre,
                presentacion: medicine.presentacion,
                descripcion: medicine.descripcion,
              }}
              medicineId={medicine.id}
              mode="edit"
            />
          </section>
        </div>
      </section>
    </main>
  );
}
