import type { Metadata } from "next";
import { BarChart3, Database, SlidersHorizontal } from "lucide-react";

import { ReportsWorkspace } from "@/components/reports/reports-workspace";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Reportes | ClinicaPlus",
  description: "Centro de reportes para visualizar salidas filtradas de ClinicaPlus.",
};

const highlightCards = [
  {
    title: "Filtros claros",
    description: "La interfaz ya separa rango de fechas y filtros opcionales segun cada reporte.",
    icon: SlidersHorizontal,
  },
  {
    title: "Conexion preparada",
    description: "Los nombres de parametros reflejan directamente los SQL base definidos por el proyecto.",
    icon: Database,
  },
  {
    title: "Visualizacion lista",
    description: "La tabla y la experiencia de exploracion ya estan montadas para recibir datos reales.",
    icon: BarChart3,
  },
];

export default function ReportsPage() {
  return (
    <main className="app-shell pb-10">
      <SiteHeader current="reportes" />

      <section className="px-4 pb-8 pt-8 md:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-[1320px] space-y-6">
          <section className="mx-auto max-w-6xl rounded-[2rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(241,246,243,0.92))] p-6 shadow-[0_20px_60px_rgba(17,33,31,0.08)] md:p-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl space-y-4">
                <Badge variant="secondary">Modulo de reportes</Badge>
                <div className="space-y-4">
                  <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
                    Un centro de reportes para mostrar todos los datos escenciales de nuestra clinica.
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                    Esta pagina deja resuelta la experiencia de uso: seleccion del reporte, filtros,
                    vista tabular y estructura de salida. El siguiente paso sera enlazar el backend
                    interno con PostgreSQL sin redisenar la interfaz.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3 lg:max-w-2xl">
                {highlightCards.map((card) => {
                  const Icon = card.icon;

                  return (
                    <article
                      className="rounded-[1.5rem] border border-border/70 bg-white/82 p-4"
                      key={card.title}
                    >
                      <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="size-4" />
                      </div>
                      <h2 className="mt-4 text-sm font-semibold">{card.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.description}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <div className="w-full">
            <ReportsWorkspace />
          </div>
        </div>
      </section>
    </main>
  );
}