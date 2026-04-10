import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { requireSession } from "@/lib/auth";
import { getAppointmentFormOptions } from "@/lib/appointments";
import { AppointmentForm } from "@/components/appointments/appointment-form";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export default async function NewAppointmentPage() {
  await requireSession();
  const options = await getAppointmentFormOptions();

  return (
    <main className="app-shell pb-10">
      <SiteHeader current="citas" />

      <section className="px-4 pb-8 pt-8 md:px-8 lg:px-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <Button asChild className="rounded-full px-5" variant="outline">
            <Link href="/citas">
              <ArrowLeft className="size-4" />
              Volver a citas
            </Link>
          </Button>

          <section className="rounded-[2rem] border border-border/70 bg-white/88 p-6 shadow-[0_18px_50px_rgba(17,33,31,0.08)] md:p-8">
            <AppointmentForm
              doctors={options.doctors}
              mode="create"
              offices={options.offices}
              patients={options.patients}
            />
          </section>
        </div>
      </section>
    </main>
  );
}
