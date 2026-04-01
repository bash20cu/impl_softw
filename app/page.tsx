export default function Home() {
  return (
    <main className="app-shell px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="card overflow-hidden p-6 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <span className="eyebrow">
                <span className="dot" />
                Monolito SSR con Next.js
              </span>
              <div className="space-y-4">
                <h1 className="section-title max-w-3xl font-semibold">
                  ClinicaPlus organiza citas, expedientes y operacion clinica
                  desde una sola plataforma.
                </h1>
                <p className="max-w-2xl text-lg leading-8 muted-copy">
                  Este arranque del proyecto ya contempla despliegue en Vercel,
                  PostgreSQL local con Docker y una base pensada para crecer por
                  modulos sin salirnos del enfoque mas simple de mantener.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a className="pill-link pill-link-primary" href="/login">
                  Ir al login
                </a>
                <a className="pill-link pill-link-secondary" href="/dashboard">
                  Ver dashboard
                </a>
              </div>
            </div>

            <aside className="card bg-[rgba(240,238,229,0.7)] p-5">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                  Estado inicial
                </p>
                <div className="stat-grid">
                  <div className="module-card">
                    <p className="text-3xl font-semibold">12</p>
                    <p className="mt-2 text-sm muted-copy">tablas propuestas</p>
                  </div>
                  <div className="module-card">
                    <p className="text-3xl font-semibold">3</p>
                    <p className="mt-2 text-sm muted-copy">roles de acceso</p>
                  </div>
                  <div className="module-card">
                    <p className="text-3xl font-semibold">2</p>
                    <p className="mt-2 text-sm muted-copy">reportes base</p>
                  </div>
                  <div className="module-card">
                    <p className="text-3xl font-semibold">SSR</p>
                    <p className="mt-2 text-sm muted-copy">
                      enfoque simple y mantenible
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="card p-6 md:p-8">
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                Modulos iniciales
              </p>
              <h2 className="mt-3 text-2xl font-semibold">
                La maqueta del backend ya esta pensada por dominio
              </h2>
            </div>
            <div className="module-grid">
              {[
                "Autenticacion",
                "Pacientes",
                "Doctores",
                "Especialidades",
                "Citas",
                "Expedientes",
                "Recetas",
                "Facturacion",
                "Pagos",
                "Reportes",
              ].map((module) => (
                <article className="module-card" key={module}>
                  <h3 className="text-lg font-semibold">{module}</h3>
                  <p className="mt-2 text-sm leading-6 muted-copy">
                    Modulo listo para implementarse como ruta SSR y capa de
                    acceso a datos en el monolito.
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
