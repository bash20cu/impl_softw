import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getPrescriptionFormOptions } from "@/lib/prescriptions";
import { requireSession } from "@/lib/auth";
import { PrescriptionForm } from "@/components/prescriptions/prescription-form";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export default async function NewPrescriptionPage() {
  await requireSession();
  const options = await getPrescriptionFormOptions();

  return (
    <main className="app-shell pb-10">
      <SiteHeader />
      <section className="px-4 pb-8 pt-8 md:px-8 lg:px-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <Button asChild className="rounded-full px-5" variant="outline">
            <Link href="/recetas">
              <ArrowLeft className="size-4" />
              Volver a recetas
            </Link>
          </Button>
          <section className="rounded-[2rem] border border-border/70 bg-white/88 p-6">
            <PrescriptionForm medicines={options.medicines} mode="create" records={options.records} />
          </section>
        </div>
      </section>
    </main>
  );
}
