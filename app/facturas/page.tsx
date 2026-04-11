import Link from "next/link";
import { ArrowRight, CreditCard, Plus, ReceiptText } from "lucide-react";

import { requireSession } from "@/lib/auth";
import { getInvoicesList } from "@/lib/billing";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type InvoicesPageProps = {
  searchParams?: Promise<{ pacienteId?: string }>;
};

export default async function InvoicesPage({ searchParams }: InvoicesPageProps) {
  await requireSession();
  const resolvedSearchParams = (await searchParams) ?? {};
  const patientId = resolvedSearchParams.pacienteId;
  const invoices = await getInvoicesList(patientId);

  return (
    <main className="app-shell pb-10">
      <SiteHeader current="facturas" />

      <section className="page-frame">
        <div className="page-stack">
          <section className="hero-panel">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-3">
                <Badge variant="secondary">Modulo de facturas y pagos</Badge>
                <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
                  Control administrativo con pagos simulados en colones
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                  Este modulo organiza el cobro interno, el estado de cada factura y los pagos demo del proyecto.
                  La interfaz deja claro que es una simulacion academica y no una pasarela real.
                </p>
              </div>

              <div className="flex flex-col gap-3 md:items-end">
                <div className="info-pill text-sm">
                  <p className="font-medium text-primary">{invoices.length} factura(s) registradas</p>
                  <p className="mt-1 text-muted-foreground">
                    {patientId ? "Filtrado por paciente." : "Vista general de facturacion."}
                  </p>
                </div>
                <Button asChild className="rounded-lg px-5">
                  <Link href={patientId ? `/facturas/nuevo?pacienteId=${patientId}` : "/facturas/nuevo"}>
                    <Plus className="size-4" />
                    Nueva factura
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          <section className="grid gap-4">
            {invoices.map((invoice) => (
              <article
                className="list-card"
                key={invoice.id}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="outline">{invoice.numeroFactura}</Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ReceiptText className="size-4 text-primary" />
                        Emitida: {invoice.fechaEmision}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CreditCard className="size-4 text-primary" />
                        Estado: {invoice.estado}
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{invoice.paciente}</h2>
                      <div className="mt-2 flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:flex-wrap md:items-center md:gap-4">
                        <span>Expediente: {invoice.numeroExpediente}</span>
                        <span>Total: {invoice.montoTotal}</span>
                        <span>Saldo pendiente: {invoice.saldoPendiente}</span>
                        <span>Cita: {invoice.citaFecha}</span>
                      </div>
                    </div>
                  </div>

                  <Button asChild className="rounded-lg px-5">
                    <Link href={`/facturas/${invoice.id}`}>
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
