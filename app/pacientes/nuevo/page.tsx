import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { requireSession } from "@/lib/auth";
import { PatientForm } from "@/components/patients/patient-form";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export default async function NewPatientPage() {
  await requireSession();

  return (
    <main className="app-shell pb-10">
      <SiteHeader current="pacientes" />

      <section className="px-4 pb-8 pt-8 md:px-8 lg:px-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <Button asChild className="rounded-full px-5" variant="outline">
            <Link href="/pacientes">
              <ArrowLeft className="size-4" />
              Volver a pacientes
            </Link>
          </Button>

          <section className="rounded-[2rem] border border-border/70 bg-white/88 p-6 shadow-[0_18px_50px_rgba(17,33,31,0.08)] md:p-8">
            <PatientForm mode="create" />
          </section>
        </div>
      </section>
    </main>
  );
}
