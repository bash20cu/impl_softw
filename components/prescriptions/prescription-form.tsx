"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, Save } from "lucide-react";

import { createPrescriptionAction, type PrescriptionFormState, updatePrescriptionAction } from "@/lib/prescription-actions";
import type { PrescriptionFormOption } from "@/lib/prescriptions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const initialState: PrescriptionFormState = { error: null };

function SubmitButton({ mode }: { mode: "create" | "edit" }) {
  const { pending } = useFormStatus();

  return (
    <Button className="rounded-full px-6" disabled={pending} type="submit">
      <Save className="size-4" />
      {pending ? "Guardando..." : mode === "create" ? "Crear receta" : "Guardar cambios"}
    </Button>
  );
}

export function PrescriptionForm({
  mode,
  prescriptionId,
  defaultValues,
  records,
  medicines,
}: {
  mode: "create" | "edit";
  prescriptionId?: string;
  defaultValues?: {
    expedienteId: string;
    medicamentoId: string;
    dosis: string;
    frecuencia: string;
    duracion: string;
    indicaciones: string;
  };
  records: PrescriptionFormOption[];
  medicines: PrescriptionFormOption[];
}) {
  const action = mode === "create"
    ? createPrescriptionAction
    : updatePrescriptionAction.bind(null, prescriptionId ?? "");

  const [state, formAction] = useActionState<PrescriptionFormState, FormData>(action, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <Badge variant="secondary">{mode === "create" ? "Nueva receta" : "Editar receta"}</Badge>

      {state.error ? (
        <div className="rounded-[1.25rem] border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p>{state.error}</p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="expedienteId">Expediente</Label>
          <select className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm" defaultValue={defaultValues?.expedienteId ?? ""} id="expedienteId" name="expedienteId">
            <option value="">Seleccionar expediente</option>
            {records.map((record) => (
              <option key={record.id} value={record.id}>
                {record.label} {record.helper ? `· ${record.helper}` : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="medicamentoId">Medicamento</Label>
          <select className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm" defaultValue={defaultValues?.medicamentoId ?? ""} id="medicamentoId" name="medicamentoId">
            <option value="">Seleccionar medicamento</option>
            {medicines.map((medicine) => (
              <option key={medicine.id} value={medicine.id}>
                {medicine.label} {medicine.helper ? `· ${medicine.helper}` : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="dosis">Dosis</Label>
          <input className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm" defaultValue={defaultValues?.dosis ?? ""} id="dosis" name="dosis" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="frecuencia">Frecuencia</Label>
          <input className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm" defaultValue={defaultValues?.frecuencia ?? ""} id="frecuencia" name="frecuencia" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duracion">Duracion</Label>
          <input className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm" defaultValue={defaultValues?.duracion ?? ""} id="duracion" name="duracion" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="indicaciones">Indicaciones</Label>
        <textarea className="min-h-28 w-full rounded-xl border border-input bg-white px-3 py-2 text-sm" defaultValue={defaultValues?.indicaciones ?? ""} id="indicaciones" name="indicaciones" />
      </div>

      <SubmitButton mode={mode} />
    </form>
  );
}
