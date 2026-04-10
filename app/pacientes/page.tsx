import Link from "next/link";
import { ArrowRight, FileSearch, Phone, UserRound } from "lucide-react";

import { requireSession } from "@/lib/auth";
import { getPatientsList } from "@/lib/patients";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function PatientsPage() {
  await requireSession();
  const patients = await getPatientsList();

  return (
    <main className="app-shell pb-10">
      <SiteHeader current="pacientes" />

      <section className="px-4 pb-8 pt-8 md:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="rounded-[2rem] border border-border/70 bg-white/85 p-6 shadow-[0_18px_50px_rgba(17,33,31,0.08)] md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-3">
                <Badge variant="secondary">Modulo de pacientes</Badge>
                <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
                  Listado SSR de pacientes conectado a PostgreSQL
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                  Este modulo ya permite consultar los pacientes sembrados en la base y
                  abrir un detalle individual para seguir enlazando expedientes, citas y facturas.
                </p>
              </div>

              <div className="rounded-[1.4rem] border border-primary/20 bg-primary/[0.05] px-4 py-3 text-sm">
                <p className="font-medium text-primary">{patients.length} paciente(s) encontrados</p>
                <p className="mt-1 text-muted-foreground">Vista viva desde la base de datos.</p>
              </div>
            </div>
          </section>

          <section className="grid gap-4">
            {patients.map((patient) => (
              <article
                className="rounded-[1.7rem] border border-border/70 bg-white/88 p-5 shadow-[0_12px_35px_rgba(17,33,31,0.05)]"
                key={patient.id}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="outline">{patient.numeroExpediente}</Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <UserRound className="size-4 text-primary" />
                        Fecha de nacimiento: {patient.fechaNacimiento}
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{patient.nombreCompleto}</h2>
                      <div className="mt-2 flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:flex-wrap md:items-center md:gap-4">
                        <span className="inline-flex items-center gap-2">
                          <Phone className="size-4 text-primary" />
                          {patient.telefono}
                        </span>
                        <span>{patient.email}</span>
                        <span>Emergencia: {patient.contactoEmergencia}</span>
                      </div>
                    </div>
                  </div>

                  <Button asChild className="rounded-full px-5">
                    <Link href={`/pacientes/${patient.id}`}>
                      Ver detalle
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </section>

          {patients.length === 0 ? (
            <section className="rounded-[1.7rem] border border-dashed border-border/70 bg-white/70 p-10 text-center">
              <div className="mx-auto max-w-md space-y-3">
                <FileSearch className="mx-auto size-8 text-primary" />
                <h2 className="text-xl font-semibold">No hay pacientes registrados</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  Cuando agregues nuevos datos a la tabla `pacientes`, apareceran aqui automaticamente.
                </p>
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </main>
  );
}
