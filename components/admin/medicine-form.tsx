"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, Save } from "lucide-react";

import { createMedicineAction, type CatalogFormState, updateMedicineAction } from "@/lib/catalog-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: CatalogFormState = { error: null };

function SubmitButton({ mode }: { mode: "create" | "edit" }) {
  const { pending } = useFormStatus();

  return (
    <Button className="rounded-full px-6" disabled={pending} type="submit">
      <Save className="size-4" />
      {pending ? "Guardando..." : mode === "create" ? "Crear medicamento" : "Guardar cambios"}
    </Button>
  );
}

export function MedicineForm({
  mode,
  medicineId,
  defaultValues,
}: {
  mode: "create" | "edit";
  medicineId?: string;
  defaultValues?: { nombre: string; presentacion: string; descripcion: string };
}) {
  const action = mode === "create"
    ? createMedicineAction
    : updateMedicineAction.bind(null, medicineId ?? "");

  const [state, formAction] = useActionState<CatalogFormState, FormData>(action, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <Badge variant="secondary">{mode === "create" ? "Nuevo medicamento" : "Editar medicamento"}</Badge>

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
          <Label htmlFor="nombre">Nombre</Label>
          <Input defaultValue={defaultValues?.nombre ?? ""} id="nombre" name="nombre" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="presentacion">Presentacion</Label>
          <Input defaultValue={defaultValues?.presentacion ?? ""} id="presentacion" name="presentacion" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripcion</Label>
        <textarea
          className="min-h-28 w-full rounded-xl border border-input bg-white px-3 py-2 text-sm"
          defaultValue={defaultValues?.descripcion ?? ""}
          id="descripcion"
          name="descripcion"
        />
      </div>

      <SubmitButton mode={mode} />
    </form>
  );
}
