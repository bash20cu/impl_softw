import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { requireSession } from "@/lib/auth";
import { getPatientDetail } from "@/lib/patients";
import { PatientForm } from "@/components/patients/patient-form";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

type EditPatientPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPatientPage({ params }: EditPatientPageProps) {
  await requireSession();
  const { id } = await params;
  const patient = await getPatientDetail(id);

  if (!patient) {
    notFound();
  }

  return (
    <main className="app-shell pb-10">
      <SiteHeader current="pacientes" />

      <section className="px-4 pb-8 pt-8 md:px-8 lg:px-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <Button asChild className="rounded-full px-5" variant="outline">
            <Link href={`/pacientes/${patient.id}`}>
              <ArrowLeft className="size-4" />
              Volver al detalle
            </Link>
          </Button>

          <section className="rounded-[2rem] border border-border/70 bg-white/88 p-6 shadow-[0_18px_50px_rgba(17,33,31,0.08)] md:p-8">
            <PatientForm
              defaultValues={{
                numeroExpediente: patient.numeroExpediente,
                nombre: patient.nombre,
                apellido1: patient.apellido1,
                apellido2: patient.apellido2,
                fechaNacimiento: patient.fechaNacimiento,
                genero: patient.genero === "-" ? "" : patient.genero,
                telefono: patient.telefono === "-" ? "" : patient.telefono,
                email: patient.email === "-" ? "" : patient.email,
                direccion: patient.direccion === "-" ? "" : patient.direccion,
                contactoEmergenciaNombre:
                  patient.contactoEmergencia === "-" ? "" : patient.contactoEmergencia,
                contactoEmergenciaTelefono:
                  patient.contactoEmergenciaTelefono === "-" ? "" : patient.contactoEmergenciaTelefono,
              }}
              mode="edit"
              patientId={patient.id}
            />
          </section>
        </div>
      </section>
    </main>
  );
}
