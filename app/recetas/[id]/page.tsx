import Link from "next/link";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { notFound } from "next/navigation";

import { deletePrescriptionAction } from "@/lib/prescription-actions";
import { getPrescriptionById } from "@/lib/prescriptions";
import { requireSession } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type PrescriptionDetailPageProps = { params: Promise<{ id: string }> };

export default async function PrescriptionDetailPage({ params }: PrescriptionDetailPageProps) {
  await requireSession();
  const { id } = await params;
  const prescription = await getPrescriptionById(id);

  if (!prescription) {
    notFound();
  }

  return (
    <main className="app-shell pb-10">
      <SiteHeader />
      <section className="px-4 pb-8 pt-8 md:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-full px-5" variant="outline">
              <Link href="/recetas">
                <ArrowLeft className="size-4" />
                Volver a recetas
              </Link>
            </Button>
            <Button asChild className="rounded-full px-5" variant="outline">
              <Link href={`/recetas/${prescription.id}/editar`}>
                <Pencil className="size-4" />
                Editar
              </Link>
            </Button>
            <form action={deletePrescriptionAction.bind(null, prescription.id)}>
              <Button className="rounded-full px-5" type="submit" variant="outline">
                <Trash2 className="size-4" />
                Eliminar
              </Button>
            </form>
          </div>

          <section className="rounded-[2rem] border border-border/70 bg-white/88 p-6">
            <Badge variant="secondary">{prescription.numeroExpediente}</Badge>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">{prescription.medicamento}</h1>
            <p className="mt-2 text-sm text-muted-foreground">Paciente: {prescription.paciente}</p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <article className="rounded-[1.2rem] border border-border/70 bg-muted/35 p-4">
                <p className="text-sm text-muted-foreground">Dosis</p>
                <p className="mt-2 font-semibold">{prescription.dosis}</p>
              </article>
              <article className="rounded-[1.2rem] border border-border/70 bg-muted/35 p-4">
                <p className="text-sm text-muted-foreground">Frecuencia</p>
                <p className="mt-2 font-semibold">{prescription.frecuencia}</p>
              </article>
              <article className="rounded-[1.2rem] border border-border/70 bg-muted/35 p-4">
                <p className="text-sm text-muted-foreground">Duracion</p>
                <p className="mt-2 font-semibold">{prescription.duracion}</p>
              </article>
            </div>

            <article className="mt-4 rounded-[1.2rem] border border-border/70 bg-muted/35 p-4">
              <p className="text-sm text-muted-foreground">Indicaciones</p>
              <p className="mt-2 text-sm leading-6">{prescription.indicaciones || "-"}</p>
            </article>
          </section>
        </div>
      </section>
    </main>
  );
}
