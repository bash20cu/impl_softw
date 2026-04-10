import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { getOfficeById } from "@/lib/admin-catalogs";
import { requireSession } from "@/lib/auth";
import { OfficeForm } from "@/components/admin/office-form";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

type EditOfficePageProps = { params: Promise<{ id: string }> };

export default async function EditOfficePage({ params }: EditOfficePageProps) {
  await requireSession();
  const { id } = await params;
  const office = await getOfficeById(id);

  if (!office) {
    notFound();
  }

  return (
    <main className="app-shell pb-10">
      <SiteHeader />
      <section className="px-4 pb-8 pt-8 md:px-8 lg:px-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <Button asChild className="rounded-full px-5" variant="outline">
            <Link href="/consultorios">
              <ArrowLeft className="size-4" />
              Volver a consultorios
            </Link>
          </Button>
          <section className="rounded-[2rem] border border-border/70 bg-white/88 p-6">
            <OfficeForm
              defaultValues={{
                nombre: office.nombre,
                ubicacion: office.ubicacion,
                piso: office.piso,
                estado: office.estado,
              }}
              mode="edit"
              officeId={office.id}
            />
          </section>
        </div>
      </section>
    </main>
  );
}
