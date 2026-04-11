import Link from "next/link";
import { ArrowRight, Mail, Phone, Plus, Stethoscope } from "lucide-react";

import { requireSession } from "@/lib/auth";
import { getDoctorsList } from "@/lib/doctors";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function DoctorsPage() {
  await requireSession();
  const doctors = await getDoctorsList();

  return (
    <main className="app-shell pb-10">
      <SiteHeader current="doctores" />

      <section className="px-4 pb-8 pt-8 md:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="hero-panel">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-3">
                <Badge variant="secondary">Modulo de doctores</Badge>
                <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
                  Doctores activos para agenda, expedientes y reportes
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                  Este modulo centraliza el personal medico y deja listo el flujo
                  para asignar citas, registrar expedientes y filtrar reportes por doctor.
                </p>
              </div>

              <div className="flex flex-col gap-3 md:items-end">
                <div className="info-pill text-sm">
                  <p className="font-medium text-primary">{doctors.length} doctor(es) activos</p>
                  <p className="mt-1 text-muted-foreground">Lectura viva desde PostgreSQL.</p>
                </div>
                <Button asChild className="rounded-lg px-5">
                  <Link href="/doctores/nuevo">
                    <Plus className="size-4" />
                    Nuevo doctor
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          <section className="grid gap-4">
            {doctors.map((doctor) => (
              <article
                className="list-card"
                key={doctor.id}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="outline">{doctor.codigoColegiado}</Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Stethoscope className="size-4 text-primary" />
                        {doctor.especialidad}
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{doctor.nombreCompleto}</h2>
                      <div className="mt-2 flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:flex-wrap md:items-center md:gap-4">
                        <span className="inline-flex items-center gap-2">
                          <Mail className="size-4 text-primary" />
                          {doctor.email}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <Phone className="size-4 text-primary" />
                          {doctor.telefono}
                        </span>
                        <span>Ingreso: {doctor.fechaContratacion}</span>
                      </div>
                    </div>
                  </div>

                  <Button asChild className="rounded-lg px-5">
                    <Link href={`/doctores/${doctor.id}`}>
                      Ver detalle
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}
