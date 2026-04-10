export type ReportId = "citas-por-doctor" | "pacientes-y-pagos";

export type ReportFilterDefinition = {
  key: string;
  label: string;
  type: "date" | "text" | "select";
  placeholder?: string;
  helperText?: string;
  defaultValue: string;
  options?: Array<{ label: string; value: string }>;
};

export type ReportColumnDefinition = {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
};

export type ReportRow = Record<string, string | number>;

export type ReportDefinition = {
  id: ReportId;
  badge: string;
  title: string;
  description: string;
  sqlFile: string;
  accent: string;
  filters: ReportFilterDefinition[];
  columns: ReportColumnDefinition[];
  previewRows: ReportRow[];
  emptyMessage: string;
};

export type ReportFilterValues = Record<string, string>;

const defaultDateStart = "2026-04-01";
const defaultDateEnd = "2026-04-30";

export const reportDefinitions: ReportDefinition[] = [
  {
    id: "citas-por-doctor",
    badge: "Reporte operacional",
    title: "Citas por doctor y rango de fechas",
    description:
      "Vista ideal para recepcion y coordinacion medica. Se alinea con la tabla de citas y con la relacion entre doctores, pacientes, consultorios y especialidades.",
    sqlFile: "db/reports/01-reporte-citas-por-doctor.sql",
    accent: "from-emerald-600/15 via-white to-white",
    filters: [
      {
        key: "fecha_inicio",
        label: "Fecha inicial",
        type: "date",
        helperText: "Parametro existente en el SQL base.",
        defaultValue: defaultDateStart,
      },
      {
        key: "fecha_fin",
        label: "Fecha final",
        type: "date",
        helperText: "Parametro existente en el SQL base.",
        defaultValue: defaultDateEnd,
      },
      {
        key: "codigo_doctor",
        label: "Codigo del doctor",
        type: "text",
        placeholder: "Ej. COL-1001",
        helperText: "Opcional. Coincide con el filtro del reporte SQL.",
        defaultValue: "",
      },
      {
        key: "estado",
        label: "Estado de la cita",
        type: "select",
        helperText: "Opcional. Filtra por el estado actual de la cita.",
        defaultValue: "",
        options: [
          { label: "Todos los estados", value: "" },
          { label: "Programada", value: "programada" },
          { label: "Confirmada", value: "confirmada" },
          { label: "Atendida", value: "atendida" },
          { label: "Cancelada", value: "cancelada" },
          { label: "Ausente", value: "ausente" },
        ],
      },
    ],
    columns: [
      { key: "fecha", label: "Fecha" },
      { key: "hora_inicio", label: "Inicio" },
      { key: "hora_fin", label: "Fin" },
      { key: "estado", label: "Estado" },
      { key: "paciente", label: "Paciente" },
      { key: "doctor", label: "Doctor" },
      { key: "especialidad", label: "Especialidad" },
      { key: "consultorio", label: "Consultorio" },
    ],
    previewRows: [],
    emptyMessage:
      "No hay filas para los filtros seleccionados.",
  },
  {
    id: "pacientes-y-pagos",
    badge: "Reporte financiero-clinico",
    title: "Pacientes atendidos y pagos por periodo",
    description:
      "Resumen por paciente para defensa del proyecto y analisis administrativo. Se apoya en expedientes, facturas y pagos.",
    sqlFile: "db/reports/02-reporte-pacientes-y-pagos.sql",
    accent: "from-amber-500/15 via-white to-white",
    filters: [
      {
        key: "fecha_inicio",
        label: "Fecha inicial",
        type: "date",
        helperText: "Parametro existente en el SQL base.",
        defaultValue: defaultDateStart,
      },
      {
        key: "fecha_fin",
        label: "Fecha final",
        type: "date",
        helperText: "Parametro existente en el SQL base.",
        defaultValue: defaultDateEnd,
      },
    ],
    columns: [
      { key: "numero_expediente", label: "Expediente" },
      { key: "paciente", label: "Paciente" },
      { key: "consultas_atendidas", label: "Consultas", align: "right" },
      { key: "facturas_emitidas", label: "Facturas", align: "right" },
      { key: "total_pagado", label: "Total pagado", align: "right" },
      { key: "primera_atencion_periodo", label: "Primera atencion" },
      { key: "ultima_atencion_periodo", label: "Ultima atencion" },
    ],
    previewRows: [],
    emptyMessage:
      "No hay resumenes para el periodo seleccionado.",
  },
];

export function getInitialFilters() {
  return Object.fromEntries(
    reportDefinitions.map((report) => [
      report.id,
      Object.fromEntries(report.filters.map((filter) => [filter.key, filter.defaultValue])),
    ]),
  ) as Record<ReportId, ReportFilterValues>;
}

export function getReportDefinition(reportId: ReportId) {
  return reportDefinitions.find((report) => report.id === reportId) ?? reportDefinitions[0];
}

export function isReportId(value: string): value is ReportId {
  return reportDefinitions.some((report) => report.id === value);
}

export function normalizeReportId(value?: string): ReportId {
  if (value && isReportId(value)) {
    return value;
  }

  return reportDefinitions[0].id;
}

export function resolveFiltersForReport(
  reportId: ReportId,
  source: URLSearchParams | Record<string, string | string[] | undefined>,
) {
  const report = getReportDefinition(reportId);

  return Object.fromEntries(
    report.filters.map((filter) => {
      const rawValue =
        source instanceof URLSearchParams
          ? source.get(filter.key)
          : source[filter.key];

      const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;

      return [filter.key, typeof value === "string" && value.length > 0 ? value : filter.defaultValue];
    }),
  ) as ReportFilterValues;
}
