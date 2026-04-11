"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CreditCard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  processSimulatedPaymentAction,
  type PaymentFormState,
} from "@/lib/billing-actions";

type SimulatedPaymentFormProps = {
  invoiceId: string;
  suggestedAmount?: string;
};

const paymentInitialState: PaymentFormState = {
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="rounded-lg px-6" disabled={pending} type="submit">
      <CreditCard className="size-4" />
      {pending ? "Procesando pago simulado..." : "Procesar pago simulado"}
    </Button>
  );
}

export function SimulatedPaymentForm({
  invoiceId,
  suggestedAmount,
}: SimulatedPaymentFormProps) {
  const [state, formAction] = useActionState<PaymentFormState, FormData>(
    processSimulatedPaymentAction.bind(null, invoiceId),
    paymentInitialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="rounded-[1.25rem] border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        Pago simulado: esta accion no conecta con SINPE, datafono, transferencia bancaria ni ninguna pasarela real. Solo registra un pago demo en el sistema.
      </div>

      {state.error ? (
        <div className="rounded-[1.25rem] border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3 text-red-900">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p className="text-sm leading-6">{state.error}</p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="metodoPago">Medio de pago</Label>
          <select
            className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm"
            defaultValue="tarjeta"
            id="metodoPago"
            name="metodoPago"
          >
            <option value="tarjeta">Tarjeta</option>
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
            <option value="sinpe">SINPE</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="monto">Monto simulado (CRC)</Label>
          <input
            className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm"
            defaultValue={suggestedAmount ?? ""}
            id="monto"
            min="0"
            name="monto"
            step="0.01"
            type="number"
          />
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
