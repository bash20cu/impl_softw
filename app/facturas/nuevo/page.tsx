import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { requireSession } from "@/lib/auth";
import { getInvoiceFormOptions } from "@/lib/billing";
import { InvoiceForm } from "@/components/billing/invoice-form";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

type NewInvoicePageProps = {
  searchParams?: Promise<{ pacienteId?: string; citaId?: string }>;
};

export default async function NewInvoicePage({ searchParams }: NewInvoicePageProps) {
  await requireSession();
  const resolvedSearchParams = (await searchParams) ?? {};
  const options = await getInvoiceFormOptions();

  return (
    <main className="app-shell pb-10">
      <SiteHeader current="facturas" />

      <section className="px-4 pb-8 pt-8 md:px-8 lg:px-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <Button asChild className="rounded-full px-5" variant="outline">
            <Link href={resolvedSearchParams.pacienteId ? `/facturas?pacienteId=${resolvedSearchParams.pacienteId}` : "/facturas"}>
              <ArrowLeft className="size-4" />
              Volver a facturas
            </Link>
          </Button>

          <section className="rounded-[2rem] border border-border/70 bg-white/88 p-6 shadow-[0_18px_50px_rgba(17,33,31,0.08)] md:p-8">
            <InvoiceForm
              appointments={options.appointments}
              defaultValues={{
                numeroFactura: "",
                pacienteId: resolvedSearchParams.pacienteId ?? "",
                citaId: resolvedSearchParams.citaId ?? "",
                montoTotal: "",
              }}
              patients={options.patients}
            />
          </section>
        </div>
      </section>
    </main>
  );
}
