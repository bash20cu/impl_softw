"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, Save } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createInvoiceAction, type InvoiceFormState } from "@/lib/billing-actions";
import type { InvoiceFormOption } from "@/lib/billing";

type InvoiceFormProps = {
  defaultValues?: {
    numeroFactura: string;
    pacienteId: string;
    citaId: string;
    montoTotal: string;
  };
  patients: InvoiceFormOption[];
  appointments: InvoiceFormOption[];
};

const invoiceInitialState: InvoiceFormState = {
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="rounded-full px-6" disabled={pending} type="submit">
      <Save className="size-4" />
      {pending ? "Creando factura..." : "Crear factura"}
    </Button>
  );
}

export function InvoiceForm({ defaultValues, patients, appointments }: InvoiceFormProps) {
  const [state, formAction] = useActionState<InvoiceFormState, FormData>(
    createInvoiceAction,
    invoiceInitialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="flex items-center justify-between">
        <Badge variant="secondary">Nueva factura</Badge>
      </div>

      {state.error ? (
        <div className="rounded-[1.25rem] border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3 text-red-900">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p className="text-sm leading-6">{state.error}</p>
          </div>
        </div>
      ) : null}

      <div className="rounded-[1.25rem] border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        Simulacion academica: esta factura no genera XML, no se envia a Hacienda y no sustituye un comprobante electronico real.
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="numeroFactura">Numero interno de factura</Label>
          <Input
            defaultValue={defaultValues?.numeroFactura ?? ""}
            id="numeroFactura"
            name="numeroFactura"
            placeholder="Se genera automaticamente si lo dejas vacio"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="montoTotal">Monto total (CRC)</Label>
          <Input
            defaultValue={defaultValues?.montoTotal ?? ""}
            id="montoTotal"
            min="0"
            name="montoTotal"
            step="0.01"
            type="number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="citaId">Cita asociada</Label>
          <select
            className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm"
            defaultValue={defaultValues?.citaId ?? ""}
            id="citaId"
            name="citaId"
          >
            <option value="">Sin cita asociada</option>
            {appointments.map((appointment) => (
              <option key={appointment.id} value={appointment.id}>
                {appointment.label} {appointment.helper ? `· ${appointment.helper}` : ""}
              </option>
            ))}
          </select>
          <p className="text-xs leading-5 text-muted-foreground">
            Si eliges una cita, el paciente se resuelve automaticamente desde esa atencion.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pacienteId">Paciente</Label>
          <select
            className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm"
            defaultValue={defaultValues?.pacienteId ?? ""}
            id="pacienteId"
            name="pacienteId"
          >
            <option value="">Seleccionar paciente</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
