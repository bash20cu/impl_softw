export default function LoginPage() {
  return (
    <main className="app-shell px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl gap-8 lg:grid-cols-[1fr_440px]">
        <section className="flex flex-col justify-between rounded-[32px] border border-[var(--line)] bg-[linear-gradient(135deg,rgba(15,118,110,0.95),rgba(17,33,31,0.92))] p-8 text-white shadow-[0_24px_60px_rgba(17,33,31,0.22)] md:p-10">
          <div className="space-y-6">
            <span className="eyebrow border-white/20 bg-white/10 text-white">
              Acceso seguro para clinica
            </span>
            <div className="space-y-4">
              <h1 className="section-title max-w-xl font-semibold">
                Ingresa al panel central de ClinicaPlus.
              </h1>
              <p className="max-w-lg text-lg leading-8 text-white/76">
                Esta pantalla servira como base para el trabajo de Bri: login
                con validaciones, manejo de errores y acceso por roles.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {["Administrador", "Recepcionista", "Doctor"].map((role) => (
              <div
                className="rounded-2xl border border-white/14 bg-white/10 p-4"
                key={role}
              >
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/72">
                  Rol
                </p>
                <p className="mt-2 text-lg font-semibold">{role}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="card flex items-center p-6 md:p-8">
          <div className="w-full space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                Inicio de sesion
              </p>
              <h2 className="mt-3 text-3xl font-semibold">Bienvenido de vuelta</h2>
              <p className="mt-3 text-sm leading-6 muted-copy">
                Maqueta inicial del formulario. En la siguiente iteracion aqui
                entra la validacion real contra usuarios del sistema.
              </p>
            </div>

            <form className="space-y-4">
              <div>
                <label className="label" htmlFor="email">
                  Correo institucional
                </label>
                <input
                  className="field"
                  id="email"
                  name="email"
                  placeholder="recepcion@clinicaplus.com"
                  type="email"
                />
              </div>

              <div>
                <label className="label" htmlFor="password">
                  Contrasena
                </label>
                <input
                  className="field"
                  id="password"
                  name="password"
                  placeholder="Ingresa tu contrasena"
                  type="password"
                />
              </div>

              <div>
                <label className="label" htmlFor="role">
                  Rol
                </label>
                <select className="field" defaultValue="recepcionista" id="role">
                  <option value="admin">Administrador</option>
                  <option value="recepcionista">Recepcionista</option>
                  <option value="doctor">Doctor</option>
                </select>
              </div>

              <button className="submit-button" type="submit">
                Ingresar al sistema
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
