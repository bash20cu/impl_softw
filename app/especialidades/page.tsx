import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { deactivateSpecialtyAction } from "@/lib/catalog-actions";
import { getSpecialties } from "@/lib/admin-catalogs";
import { requireSession } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function SpecialtiesPage() {
  await requireSession();
  const specialties = await getSpecialties();

  return (
    <main className="app-shell pb-10">
      <SiteHeader />
      <section className="px-4 pb-8 pt-8 md:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="flex items-end justify-between rounded-[2rem] border border-border/70 bg-white/85 p-6 shadow-[0_18px_50px_rgba(17,33,31,0.08)]">
            <div className="space-y-3">
              <Badge variant="secondary">Catalogo clinico</Badge>
              <h1 className="text-4xl font-semibold tracking-tight">Especialidades</h1>
            </div>
            <Button asChild className="rounded-full px-5">
              <Link href="/especialidades/nuevo">
                <Plus className="size-4" />
                Nueva especialidad
              </Link>
            </Button>
          </div>

          <div className="grid gap-4">
            {specialties.map((specialty) => (
              <article className="rounded-[1.5rem] border border-border/70 bg-white/88 p-5" key={specialty.id}>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{specialty.nombre}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {specialty.descripcion || "Sin descripcion registrada."}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button asChild className="rounded-full px-5" variant="outline">
                      <Link href={`/especialidades/${specialty.id}/editar`}>
                        <Pencil className="size-4" />
                        Editar
                      </Link>
                    </Button>
                    <form action={deactivateSpecialtyAction.bind(null, specialty.id)}>
                      <Button className="rounded-full px-5" type="submit" variant="outline">
                        <Trash2 className="size-4" />
                        Desactivar
                      </Button>
                    </form>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
