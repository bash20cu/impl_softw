import {
  CalendarCheck2,
  ShieldCheck,
  UserRoundCog,
} from "lucide-react";

import { redirectIfAuthenticated } from "@/lib/auth";
import { LoginForm } from "@/components/auth/login-form";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
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

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return (
    <main className="app-shell pb-10">
      <SiteHeader current="login" />

      <section className="px-4 pb-8 pt-8 md:px-8 lg:px-10">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="overflow-hidden rounded-xl border border-white/60 bg-[linear-gradient(180deg,#173a37_0%,#0f766e_100%)] p-6 text-white shadow-[0_14px_34px_rgba(17,33,31,0.12)] md:p-8">
            <Badge className="rounded-md border-white/15 bg-white/10 px-3 py-1 text-white" variant="outline">
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
                    className="rounded-lg border border-white/12 bg-white/8 p-4 backdrop-blur-sm"
                    key={card.title}
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex size-11 items-center justify-center rounded-lg bg-white/12">
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

          <section className="hero-panel bg-white/90">
            <LoginForm />
          </section>
        </div>
      </section>
    </main>
  );
}
