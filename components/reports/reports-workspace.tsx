"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CalendarRange } from "lucide-react";

import {
  getReportDefinition,
  reportDefinitions,
  type ReportFilterValues,
  type ReportId,
  type ReportRow,
} from "@/lib/reporting";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type ReportsWorkspaceProps = {
  initialReportId: ReportId;
  initialFilters: ReportFilterValues;
  rows: ReportRow[];
};

export function ReportsWorkspace({
  initialReportId,
  initialFilters,
  rows,
}: ReportsWorkspaceProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [selectedReport, setSelectedReport] = useState<ReportId>(initialReportId);
  const [filtersByReport, setFiltersByReport] = useState<Record<ReportId, ReportFilterValues>>(() =>
    Object.fromEntries(
      reportDefinitions.map((report) => [
        report.id,
        report.id === initialReportId
          ? { ...initialFilters }
          : Object.fromEntries(report.filters.map((filter) => [filter.key, filter.defaultValue])),
      ]),
    ) as Record<ReportId, ReportFilterValues>,
  );

  const report = useMemo(
    () => getReportDefinition(selectedReport),
    [selectedReport],
  );

  const currentFilters = filtersByReport[selectedReport];

  const handleFilterChange = (key: string, value: string) => {
    setFiltersByReport((current) => ({
      ...current,
      [selectedReport]: {
        ...current[selectedReport],
        [key]: value,
      },
    }));
  };

  const navigateWithFilters = (reportId: ReportId, filters: ReportFilterValues) => {
    const searchParams = new URLSearchParams();
    searchParams.set("report", reportId);

    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        searchParams.set(key, value);
      }
    }

    startTransition(() => {
      router.push(`${pathname}?${searchParams.toString()}`);
    });
  };

  const handleGenerateReport = () => {
    navigateWithFilters(selectedReport, currentFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = Object.fromEntries(
      report.filters.map((filter) => [filter.key, filter.defaultValue]),
    ) as ReportFilterValues;

    setFiltersByReport((current) => ({
      ...current,
      [selectedReport]: resetFilters,
    }));

    navigateWithFilters(selectedReport, resetFilters);
  };

  const handleReportChange = (reportId: ReportId) => {
    setSelectedReport(reportId);
    navigateWithFilters(reportId, filtersByReport[reportId]);
  };

  return (
    <div className="w-full space-y-6">
      <section className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(22rem,0.82fr)_minmax(0,1.18fr)]">
          <article className="panel-card">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-3">
                <Badge variant="secondary">Filtros</Badge>
                <div className="flex flex-wrap gap-2">
                  {reportDefinitions.map((item) => (
                    <Button
                    className="rounded-lg"
                      key={item.id}
                      onClick={() => handleReportChange(item.id)}
                      type="button"
                      variant={item.id === selectedReport ? "default" : "outline"}
                    >
                      {item.title}
                    </Button>
                  ))}
                </div>
              </div>
              <CalendarRange className="size-5 text-primary" />
            </div>

            <Separator className="my-6" />

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{report.title}</h3>
              <p className="text-sm leading-6 text-muted-foreground">{report.description}</p>
            </div>

            <div className="mt-6 space-y-5">
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
              <Button
                className="rounded-lg px-5"
                disabled={isPending}
                onClick={handleGenerateReport}
                type="button"
              >
                {isPending ? "Consultando..." : "Generar reporte"}
              </Button>
              <Button
                className="rounded-lg px-5"
                disabled={isPending}
                onClick={handleResetFilters}
                type="button"
                variant="outline"
              >
                Restablecer filtros
              </Button>
            </div>

            <div className="mt-6 rounded-lg border border-border/70 bg-muted/50 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Payload actual
              </p>
              <pre className="mt-3 overflow-x-auto text-xs leading-6 text-foreground">
{JSON.stringify({ report: selectedReport, ...currentFilters }, null, 2)}
              </pre>
            </div>
          </article>

          <article className="panel-card">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <Badge variant="outline">Resultados</Badge>
                <h3 className="mt-3 text-xl font-semibold tracking-tight">
                  Tabla de salida y resumen visual
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Ahora la tabla se alimenta desde PostgreSQL real usando los filtros activos.
                </p>
              </div>

            <div className="info-pill text-sm">
                <p className="font-medium text-primary">{rows.length} fila(s) visibles</p>
                <p className="mt-1 text-muted-foreground">Consulta viva contra la base de datos.</p>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-lg border border-border/70">
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-muted/60">
                      {report.columns.map((column) => (
                        <th
                          className={cn(
                            "border-b border-border/70 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground",
                            column.align === "right"
                              ? "text-right"
                              : column.align === "center"
                                ? "text-center"
                                : "text-left",
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
                    {rows.length > 0 ? (
                      rows.map((row, index) => (
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
                        <td
                          className="px-4 py-10 text-center text-sm leading-6 text-muted-foreground"
                          colSpan={report.columns.length}
                        >
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
