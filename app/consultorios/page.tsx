import Link from "next/link";
import { Pencil, Plus } from "lucide-react";

import { getOffices } from "@/lib/admin-catalogs";
import { requireSession } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function OfficesPage() {
  await requireSession();
  const offices = await getOffices();

  return (
    <main className="app-shell pb-10">
      <SiteHeader />
      <section className="px-4 pb-8 pt-8 md:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="flex items-end justify-between rounded-[2rem] border border-border/70 bg-white/85 p-6 shadow-[0_18px_50px_rgba(17,33,31,0.08)]">
            <div className="space-y-3">
              <Badge variant="secondary">Infraestructura</Badge>
              <h1 className="text-4xl font-semibold tracking-tight">Consultorios</h1>
            </div>
            <Button asChild className="rounded-full px-5">
              <Link href="/consultorios/nuevo">
                <Plus className="size-4" />
                Nuevo consultorio
              </Link>
            </Button>
          </div>

          <div className="grid gap-4">
            {offices.map((office) => (
              <article className="rounded-[1.5rem] border border-border/70 bg-white/88 p-5" key={office.id}>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{office.nombre}</h2>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>Ubicacion: {office.ubicacion || "-"}</span>
                      <span>Piso: {office.piso || "-"}</span>
                      <span>Estado: {office.estado}</span>
                    </div>
                  </div>
                  <Button asChild className="rounded-full px-5" variant="outline">
                    <Link href={`/consultorios/${office.id}/editar`}>
                      <Pencil className="size-4" />
                      Editar
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
