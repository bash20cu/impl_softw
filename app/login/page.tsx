import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck2,
  CircleAlert,
  LockKeyhole,
  ShieldCheck,
  UserRoundCog,
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const accessCards = [
  {
    icon: UserRoundCog,
    title: "Administrador",
    description: "Gestion de usuarios, catalogos, configuracion y supervision general.",
  },
  {
    icon: CalendarCheck2,
    title: "Recepcionista",
    description: "Agenda diaria, registro de pacientes y control de pagos.",
  },
  {
    icon: ShieldCheck,
    title: "Doctor",
    description: "Consulta de expedientes, atencion clinica y seguimiento medico.",
  },
];

export default function LoginPage() {
  return (
    <main className="app-shell pb-10">
      <SiteHeader current="login" />

      <section className="px-4 pb-8 pt-8 md:px-8 lg:px-10">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="overflow-hidden rounded-[2rem] border border-white/60 bg-[linear-gradient(180deg,#173a37_0%,#0f766e_100%)] p-6 text-white shadow-[0_24px_70px_rgba(17,33,31,0.18)] md:p-8">
            <Badge className="rounded-full border-white/15 bg-white/10 px-3 py-1 text-white" variant="outline">
              Acceso central del sistema
            </Badge>
            <div className="mt-6 max-w-2xl space-y-4">
              <h1 className="text-balance text-[clamp(2.4rem,5vw,4.6rem)] font-semibold leading-[0.95] tracking-tight">
                Un login sobrio transmite mas confianza que una pantalla cargada.
              </h1>
              <p className="text-lg leading-8 text-white/78">
                Esta vista ya marca el tono de producto: clara, calmada y con jerarquia.
                Bri puede seguir desde aqui para agregar validaciones reales y flujos de sesion.
              </p>
            </div>

            <Separator className="my-8 bg-white/15" />

            <div className="grid gap-4">
              {accessCards.map((card) => {
                const Icon = card.icon;

                return (
                  <article
                    className="rounded-[1.5rem] border border-white/12 bg-white/8 p-4 backdrop-blur-sm"
                    key={card.title}
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex size-11 items-center justify-center rounded-2xl bg-white/12">
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">{card.title}</h2>
                        <p className="mt-2 text-sm leading-6 text-white/74">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="rounded-[2rem] border border-border/70 bg-white/90 p-6 shadow-[0_18px_50px_rgba(17,33,31,0.08)] md:p-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <Badge variant="secondary">Login base con shadcn/ui</Badge>
                <h2 className="text-3xl font-semibold tracking-tight">
                  Bienvenido al panel de ClinicaPlus
                </h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  La siguiente mejora natural es conectar este formulario con la tabla
                  `usuarios`, validar credenciales y redirigir segun el rol.
                </p>
              </div>

              <form className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo institucional</Label>
                  <Input
                    className="h-11 rounded-xl bg-white"
                    id="email"
                    name="email"
                    placeholder="recepcion@clinicaplus.com"
                    type="email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contrasena</Label>
                  <Input
                    className="h-11 rounded-xl bg-white"
                    id="password"
                    name="password"
                    placeholder="Ingresa tu contrasena"
                    type="password"
                  />
                </div>

                <div className="rounded-[1.25rem] border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-3 text-amber-900">
                    <CircleAlert className="mt-0.5 size-4 shrink-0" />
                    <p className="text-sm leading-6">
                      Maqueta inicial: aun no hay autenticacion real ni manejo de errores.
                      Esta pantalla ya esta lista para que Bri agregue validaciones.
                    </p>
                  </div>
                </div>

                <Button className="h-11 w-full rounded-xl text-sm" type="submit">
                  <LockKeyhole className="size-4" />
                  Ingresar al sistema
                </Button>
              </form>

              <Separator />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Acceso de prueba para administracion clinica.
                </p>
                <Button asChild className="rounded-full" variant="outline">
                  <Link href="/dashboard">
                    Ver dashboard inicial
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
