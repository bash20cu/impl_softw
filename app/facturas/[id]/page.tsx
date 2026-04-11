import Link from "next/link";
import { ArrowLeft, CreditCard, ReceiptText } from "lucide-react";
import { notFound } from "next/navigation";

import { requireSession } from "@/lib/auth";
import { getInvoiceDetail } from "@/lib/billing";
import { SimulatedPaymentForm } from "@/components/billing/simulated-payment-form";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type InvoiceDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  await requireSession();
  const { id } = await params;
  const invoice = await getInvoiceDetail(id);

  if (!invoice) {
    notFound();
  }

  return (
    <main className="app-shell pb-10">
      <SiteHeader current="facturas" />

      <section className="px-4 pb-8 pt-8 md:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-lg px-5" variant="outline">
              <Link href={`/facturas?pacienteId=${invoice.pacienteId}`}>
                <ArrowLeft className="size-4" />
                Volver a facturas
              </Link>
            </Button>
          </div>

          <section className="hero-panel">
            <div className="space-y-3">
              <Badge variant="secondary">{invoice.numeroFactura}</Badge>
              <h1 className="text-4xl font-semibold tracking-tight">{invoice.paciente}</h1>
              <div className="grid gap-2 text-sm text-muted-foreground">
                <p className="inline-flex items-center gap-2">
                  <ReceiptText className="size-4 text-primary" />
                  Fecha de emision: {invoice.fechaEmision}
                </p>
                <p className="inline-flex items-center gap-2">
                  <CreditCard className="size-4 text-primary" />
                  Estado: {invoice.estado}
                </p>
                <p>Expediente: {invoice.numeroExpediente}</p>
                <p>Cita asociada: {invoice.citaFecha}</p>
                <p>Total: {invoice.montoTotal}</p>
                <p>Total pagado: {invoice.totalPagado}</p>
                <p>Saldo pendiente: {invoice.saldoPendiente}</p>
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="panel-card">
              <h2 className="text-lg font-semibold">Pagos registrados</h2>
              <div className="mt-4 space-y-3">
                {invoice.pagos.length > 0 ? (
                  invoice.pagos.map((payment) => (
                    <div
                    className="rounded-lg border border-border/70 bg-muted/35 p-4"
                      key={payment.id}
                    >
                      <p className="text-sm font-medium">
                        {payment.metodoPago} · {payment.monto}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Referencia simulada: {payment.referencia}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Fecha: {payment.fechaPago}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm leading-6 text-muted-foreground">
                    Aun no hay pagos simulados registrados para esta factura.
                  </p>
                )}
              </div>
            </article>

            <article className="panel-card">
              <h2 className="text-lg font-semibold">Procesar pago</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Usa este formulario solo para la demo del curso. No existe integracion con una pasarela bancaria o de tarjetas.
              </p>
              <div className="mt-4">
                <SimulatedPaymentForm
                  invoiceId={invoice.id}
                  suggestedAmount={invoice.saldoPendienteValor.toFixed(2)}
                />
              </div>
            </article>
          </section>
        </div>
      </section>
    </main>
  );
}
