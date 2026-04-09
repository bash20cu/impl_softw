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
    previewRows: [
      {
        fecha: "2026-04-06",
        hora_inicio: "08:00",
        hora_fin: "08:30",
        estado: "confirmada",
        paciente: "Mariana Salas Arias",
        doctor: "Carlos Vargas Lopez",
        especialidad: "Medicina General",
        consultorio: "Consultorio A",
        codigo_doctor: "COL-1001",
      },
      {
        fecha: "2026-04-06",
        hora_inicio: "09:00",
        hora_fin: "09:45",
        estado: "programada",
        paciente: "Jose Quesada Mora",
        doctor: "Sofia Jimenez Mora",
        especialidad: "Cardiologia",
        consultorio: "Consultorio B",
        codigo_doctor: "COL-1002",
      },
      {
        fecha: "2026-04-07",
        hora_inicio: "10:00",
        hora_fin: "10:30",
        estado: "atendida",
        paciente: "Valeria Nunez Campos",
        doctor: "Carlos Vargas Lopez",
        especialidad: "Medicina General",
        consultorio: "Consultorio A",
        codigo_doctor: "COL-1001",
      },
    ],
    emptyMessage:
      "No hay filas en la vista previa con los filtros actuales.",
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
    previewRows: [
      {
        numero_expediente: "EXP-0001",
        paciente: "Mariana Salas Arias",
        consultas_atendidas: 1,
        facturas_emitidas: 1,
        total_pagado: "₡25.000,00",
        primera_atencion_periodo: "2026-04-06",
        ultima_atencion_periodo: "2026-04-06",
      },
      {
        numero_expediente: "EXP-0003",
        paciente: "Valeria Nunez Campos",
        consultas_atendidas: 1,
        facturas_emitidas: 1,
        total_pagado: "₡10.000,00",
        primera_atencion_periodo: "2026-04-07",
        ultima_atencion_periodo: "2026-04-07",
      },
      {
        numero_expediente: "EXP-0002",
        paciente: "Jose Quesada Mora",
        consultas_atendidas: 0,
        facturas_emitidas: 1,
        total_pagado: "₡0,00",
        primera_atencion_periodo: "-",
        ultima_atencion_periodo: "-",
      },
    ],
    emptyMessage:
      "No hay resumenes visibles para este periodo en la vista previa. La capa real podra devolver filas desde PostgreSQL usando estos mismos parametros.",
  },
];

export function getInitialFilters() {
  return Object.fromEntries(
    reportDefinitions.map((report) => [
      report.id,
      Object.fromEntries(report.filters.map((filter) => [filter.key, filter.defaultValue])),
    ]),
  ) as Record<ReportId, Record<string, string>>;
}

export function getReportDefinition(reportId: ReportId) {
  return reportDefinitions.find((report) => report.id === reportId) ?? reportDefinitions[0];
}

export function filterPreviewRows(
  reportId: ReportId,
  filters: Record<string, string>,
  rows: ReportRow[],
) {
  const startDate = filters.fecha_inicio;
  const endDate = filters.fecha_fin;

  return rows.filter((row) => {
    const rowDate = typeof row.fecha === "string"
      ? row.fecha
      : typeof row.primera_atencion_periodo === "string"
        ? row.primera_atencion_periodo
        : "";

    if (startDate && rowDate && rowDate !== "-" && rowDate < startDate) {
      return false;
    }

    if (endDate && rowDate && rowDate !== "-" && rowDate > endDate) {
      return false;
    }

    if (reportId === "citas-por-doctor") {
      const doctorCode = filters.codigo_doctor.trim().toLowerCase();

      if (doctorCode) {
        const rowDoctorCode = String(row.codigo_doctor ?? "").toLowerCase();

        if (!rowDoctorCode.includes(doctorCode)) {
          return false;
        }
      }

      const estado = filters.estado?.trim().toLowerCase();

      if (estado) {
        const rowEstado = String(row.estado ?? "").toLowerCase();

        if (rowEstado !== estado) {
          return false;
        }
      }
    }

    return true;
  });
}