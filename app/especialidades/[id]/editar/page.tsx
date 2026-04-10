import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { getSpecialtyById } from "@/lib/admin-catalogs";
import { requireSession } from "@/lib/auth";
import { SpecialtyForm } from "@/components/admin/specialty-form";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

type EditSpecialtyPageProps = { params: Promise<{ id: string }> };

export default async function EditSpecialtyPage({ params }: EditSpecialtyPageProps) {
  await requireSession();
  const { id } = await params;
  const specialty = await getSpecialtyById(id);

  if (!specialty) {
    notFound();
  }

  return (
    <main className="app-shell pb-10">
      <SiteHeader />
      <section className="px-4 pb-8 pt-8 md:px-8 lg:px-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <Button asChild className="rounded-full px-5" variant="outline">
            <Link href="/especialidades">
              <ArrowLeft className="size-4" />
              Volver a especialidades
            </Link>
          </Button>
          <section className="rounded-[2rem] border border-border/70 bg-white/88 p-6">
            <SpecialtyForm
              defaultValues={{ nombre: specialty.nombre, descripcion: specialty.descripcion }}
              mode="edit"
              specialtyId={specialty.id}
            />
          </section>
        </div>
      </section>
    </main>
  );
}
