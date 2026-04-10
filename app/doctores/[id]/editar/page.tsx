import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { requireSession } from "@/lib/auth";
import { getDoctorDetail, getDoctorFormOptions } from "@/lib/doctors";
import { DoctorForm } from "@/components/doctors/doctor-form";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

type EditDoctorPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditDoctorPage({ params }: EditDoctorPageProps) {
  await requireSession();
  const { id } = await params;
  const [doctor, specialties] = await Promise.all([
    getDoctorDetail(id),
    getDoctorFormOptions(),
  ]);

  if (!doctor) {
    notFound();
  }

  return (
    <main className="app-shell pb-10">
      <SiteHeader current="doctores" />

      <section className="px-4 pb-8 pt-8 md:px-8 lg:px-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <Button asChild className="rounded-full px-5" variant="outline">
            <Link href={`/doctores/${doctor.id}`}>
              <ArrowLeft className="size-4" />
              Volver al detalle
            </Link>
          </Button>

          <section className="rounded-[2rem] border border-border/70 bg-white/88 p-6 shadow-[0_18px_50px_rgba(17,33,31,0.08)] md:p-8">
            <DoctorForm
              defaultValues={{
                codigoColegiado: doctor.codigoColegiado,
                nombre: doctor.nombre,
                apellido1: doctor.apellido1,
                apellido2: doctor.apellido2,
                email: doctor.email,
                telefono: doctor.telefono === "-" ? "" : doctor.telefono,
                especialidadId: doctor.especialidadId,
                fechaContratacion: doctor.fechaContratacion === "-" ? "" : doctor.fechaContratacion,
              }}
              doctorId={doctor.id}
              mode="edit"
              specialties={specialties}
            />
          </section>
        </div>
      </section>
    </main>
  );
}
