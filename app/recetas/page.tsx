import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

import { getPrescriptions } from "@/lib/prescriptions";
import { requireSession } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function PrescriptionsPage() {
  await requireSession();
  const prescriptions = await getPrescriptions();

  return (
    <main className="app-shell pb-10">
      <SiteHeader />
      <section className="px-4 pb-8 pt-8 md:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-end justify-between rounded-[2rem] border border-border/70 bg-white/85 p-6 shadow-[0_18px_50px_rgba(17,33,31,0.08)]">
            <div className="space-y-3">
              <Badge variant="secondary">Tratamientos</Badge>
              <h1 className="text-4xl font-semibold tracking-tight">Recetas</h1>
            </div>
            <Button asChild className="rounded-full px-5">
              <Link href="/recetas/nuevo">
                <Plus className="size-4" />
                Nueva receta
              </Link>
            </Button>
          </div>

          <div className="grid gap-4">
            {prescriptions.map((prescription) => (
              <article className="rounded-[1.5rem] border border-border/70 bg-white/88 p-5" key={prescription.id}>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="outline">{prescription.numeroExpediente}</Badge>
                      <p className="text-sm text-muted-foreground">{prescription.paciente}</p>
                    </div>
                    <h2 className="mt-3 text-xl font-semibold">{prescription.medicamento}</h2>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>Dosis: {prescription.dosis}</span>
                      <span>Frecuencia: {prescription.frecuencia}</span>
                      <span>Duracion: {prescription.duracion}</span>
                    </div>
                  </div>
                  <Button asChild className="rounded-full px-5">
                    <Link href={`/recetas/${prescription.id}`}>
                      Ver detalle
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
