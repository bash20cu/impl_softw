import { healthcheckDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

const quickStats = [
  { label: "Citas del dia", value: "18" },
  { label: "Pacientes registrados", value: "245" },
  { label: "Doctores activos", value: "9" },
  { label: "Pagos pendientes", value: "7" },
];

const sections = [
  {
    name: "Pacientes",
    description: "Consulta general de pacientes y acceso al historial clinico.",
  },
  {
    name: "Citas",
    description: "Agenda diaria, estados de citas y filtros por doctor.",
  },
  {
    name: "Expedientes",
    description: "Notas clinicas, diagnosticos y seguimiento medico.",
  },
  {
    name: "Facturacion",
    description: "Control de facturas emitidas, pagos y saldos pendientes.",
  },
];

export default async function DashboardPage() {
  let databaseStatus = "Conexion pendiente";

  try {
    const result = await healthcheckDatabase();
    databaseStatus = `PostgreSQL activo: ${new Date(result.current_time).toLocaleString("es-CR")}`;
  } catch {
    databaseStatus = "No se pudo consultar la base de datos todavia";
  }

  return (
    <main className="app-shell px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="card p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <span className="eyebrow">Dashboard SSR inicial</span>
              <h1 className="text-4xl font-semibold tracking-tight">
                Panel operativo de ClinicaPlus
              </h1>
              <p className="max-w-2xl text-base leading-7 muted-copy">
                Esta pagina representa la base del modulo principal que luego
                consumira datos reales desde PostgreSQL usando componentes del
                servidor y consultas desde la capa interna del monolito.
              </p>
              <p className="text-sm font-semibold text-[var(--primary-strong)]">
                {databaseStatus}
              </p>
            </div>
            <a className="pill-link pill-link-secondary" href="/">
              Volver al inicio
            </a>
          </div>
        </section>

        <section className="stat-grid">
          {quickStats.map((stat) => (
            <article className="card p-5" key={stat.label}>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                {stat.label}
              </p>
              <p className="mt-3 text-4xl font-semibold">{stat.value}</p>
            </article>
          ))}
        </section>

        <section className="card p-6 md:p-8">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                Modulos conectables
              </p>
              <h2 className="mt-3 text-2xl font-semibold">
                Puntos de entrada del backend monolitico
              </h2>
            </div>
            <div className="module-grid">
              {sections.map((section) => (
                <article className="module-card" key={section.name}>
                  <h3 className="text-lg font-semibold">{section.name}</h3>
                  <p className="mt-2 text-sm leading-6 muted-copy">
                    {section.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
