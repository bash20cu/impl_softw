"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, Save } from "lucide-react";

import { createOfficeAction, type CatalogFormState, updateOfficeAction } from "@/lib/catalog-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: CatalogFormState = { error: null };

function SubmitButton({ mode }: { mode: "create" | "edit" }) {
  const { pending } = useFormStatus();

  return (
    <Button className="rounded-lg px-6" disabled={pending} type="submit">
      <Save className="size-4" />
      {pending ? "Guardando..." : mode === "create" ? "Crear consultorio" : "Guardar cambios"}
    </Button>
  );
}

export function OfficeForm({
  mode,
  officeId,
  defaultValues,
}: {
  mode: "create" | "edit";
  officeId?: string;
  defaultValues?: { nombre: string; ubicacion: string; piso: string; estado: string };
}) {
  const action = mode === "create"
    ? createOfficeAction
    : updateOfficeAction.bind(null, officeId ?? "");

  const [state, formAction] = useActionState<CatalogFormState, FormData>(action, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <Badge variant="secondary">{mode === "create" ? "Nuevo consultorio" : "Editar consultorio"}</Badge>

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
          <Label htmlFor="piso">Piso</Label>
          <Input defaultValue={defaultValues?.piso ?? ""} id="piso" name="piso" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ubicacion">Ubicacion</Label>
          <Input defaultValue={defaultValues?.ubicacion ?? ""} id="ubicacion" name="ubicacion" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="estado">Estado</Label>
          <select
            className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm"
            defaultValue={defaultValues?.estado ?? "disponible"}
            id="estado"
            name="estado"
          >
            <option value="disponible">Disponible</option>
            <option value="ocupado">Ocupado</option>
            <option value="mantenimiento">Mantenimiento</option>
          </select>
        </div>
      </div>

      <SubmitButton mode={mode} />
    </form>
  );
}
