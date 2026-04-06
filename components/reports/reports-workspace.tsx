"use client";

import { useMemo, useState } from "react";
import {
  CalendarRange,
  FileSpreadsheet,
} from "lucide-react";

import {
  filterPreviewRows,
  getInitialFilters,
  reportDefinitions,
  type ReportId,
} from "@/lib/reporting";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function ReportsWorkspace() {
  const [selectedReport, setSelectedReport] = useState<ReportId>(reportDefinitions[0].id);
  const [filtersByReport, setFiltersByReport] = useState(getInitialFilters);

  const report = useMemo(
    () => reportDefinitions.find((item) => item.id === selectedReport) ?? reportDefinitions[0],
    [selectedReport],
  );

  const currentFilters = filtersByReport[selectedReport];

  const previewRows = useMemo(
    () => filterPreviewRows(selectedReport, currentFilters, report.previewRows),
    [currentFilters, report.previewRows, selectedReport, report],
  );

  const handleFilterChange = (key: string, value: string) => {
    setFiltersByReport((current) => ({
      ...current,
      [selectedReport]: {
        ...current[selectedReport],
        [key]: value,
      },
    }));
  };

  const resetCurrentFilters = () => {
    const initial = getInitialFilters();

    setFiltersByReport((current) => ({
      ...current,
      [selectedReport]: initial[selectedReport],
    }));
  };

  return (
    <div className="w-full space-y-6">
      <section className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(22rem,0.82fr)_minmax(0,1.18fr)]">
          <article className="rounded-[2rem] border border-border/70 bg-white/88 p-6 shadow-[0_18px_50px_rgba(17,33,31,0.06)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <Badge variant="secondary">Filtros</Badge>
              </div>
              <CalendarRange className="size-5 text-primary" />
            </div>

            <Separator className="my-6" />

            <div className="space-y-5">
              {report.filters.map((filter) => (
                <div className="space-y-2" key={filter.key}>
                  <Label htmlFor={`${report.id}-${filter.key}`}>{filter.label}</Label>
                  {filter.type === "select" ? (
                    <select
                      className="h-11 w-full rounded-xl border border-input bg-white px-3 py-2 text-sm transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                      id={`${report.id}-${filter.key}`}
                      onChange={(event) => handleFilterChange(filter.key, event.target.value)}
                      value={currentFilters[filter.key]}
                    >
                      {filter.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      className="h-11 rounded-xl bg-white"
                      id={`${report.id}-${filter.key}`}
                      onChange={(event) => handleFilterChange(filter.key, event.target.value)}
                      placeholder={filter.placeholder}
                      type={filter.type}
                      value={currentFilters[filter.key]}
                    />
                  )}
                  {filter.helperText ? (
                    <p className="text-xs leading-5 text-muted-foreground">{filter.helperText}</p>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button className="rounded-full px-5">Generar vista previa</Button>
              <Button className="rounded-full px-5" onClick={resetCurrentFilters} type="button" variant="outline">
                Restablecer filtros
              </Button>
            </div>

            <div className="mt-6 rounded-[1.4rem] border border-border/70 bg-muted/50 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Payload preparado
              </p>
              <pre className="mt-3 overflow-x-auto text-xs leading-6 text-foreground">
{JSON.stringify(currentFilters, null, 2)}
              </pre>
            </div>
          </article>

          <article className="rounded-[2rem] border border-border/70 bg-white/88 p-6 shadow-[0_18px_50px_rgba(17,33,31,0.06)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <Badge variant="outline">Resultados</Badge>
                <h3 className="mt-3 text-xl font-semibold tracking-tight">
                  Tabla de salida y resumen visual
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  La estructura de columnas ya refleja los reportes existentes. Cambiar a datos reales
                  consistira en reemplazar la fuente de filas.
                </p>
              </div>

              <div className="rounded-[1.3rem] border border-primary/20 bg-primary/[0.05] px-4 py-3 text-sm">
                <p className="font-medium text-primary">{previewRows.length} fila(s) visibles</p>
                <p className="mt-1 text-muted-foreground">Vista previa basada en datos semilla.</p>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-[1.6rem] border border-border/70">
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-muted/60">
                      {report.columns.map((column) => (
                        <th
                          className={cn(
                            "border-b border-border/70 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground",
                            column.align === "right" ? "text-right" : column.align === "center" ? "text-center" : "text-left",
                          )}
                          key={column.key}
                          scope="col"
                        >
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.length > 0 ? (
                      previewRows.map((row, index) => (
                        <tr className="bg-white" key={`${report.id}-${index}`}> 
                          {report.columns.map((column) => (
                            <td
                              className={cn(
                                "border-b border-border/60 px-4 py-3 text-sm text-foreground",
                                column.align === "right"
                                  ? "text-right tabular-nums"
                                  : column.align === "center"
                                    ? "text-center"
                                    : "text-left",
                              )}
                              key={column.key}
                            >
                              {String(row[column.key] ?? "-")}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="px-4 py-10 text-center text-sm leading-6 text-muted-foreground" colSpan={report.columns.length}>
                          {report.emptyMessage}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}