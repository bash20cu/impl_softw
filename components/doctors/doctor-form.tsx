"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, Save } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createDoctorAction,
  type DoctorFormState,
  updateDoctorAction,
} from "@/lib/doctor-actions";
import type { DoctorFormOption } from "@/lib/doctors";

type DoctorFormValues = {
  codigoColegiado: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  email: string;
  telefono: string;
  especialidadId: string;
  fechaContratacion: string;
};

type DoctorFormProps = {
  mode: "create" | "edit";
  doctorId?: string;
  defaultValues?: DoctorFormValues;
  specialties: DoctorFormOption[];
};

const doctorInitialState: DoctorFormState = {
  error: null,
};

function SubmitButton({ mode }: { mode: "create" | "edit" }) {
  const { pending } = useFormStatus();

  return (
    <Button className="rounded-full px-6" disabled={pending} type="submit">
      <Save className="size-4" />
      {pending
        ? mode === "create"
          ? "Creando doctor..."
          : "Guardando cambios..."
        : mode === "create"
          ? "Crear doctor"
          : "Guardar cambios"}
    </Button>
  );
}

export function DoctorForm({
  mode,
  doctorId,
  defaultValues,
  specialties,
}: DoctorFormProps) {
  const action =
    mode === "create"
      ? createDoctorAction
      : updateDoctorAction.bind(null, doctorId ?? "");

  const [state, formAction] = useActionState<DoctorFormState, FormData>(
    action,
    doctorInitialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="flex items-center justify-between">
        <Badge variant="secondary">
          {mode === "create" ? "Nuevo doctor" : "Editar doctor"}
        </Badge>
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
          <Label htmlFor="codigoColegiado">Codigo colegiado</Label>
          <Input
            defaultValue={defaultValues?.codigoColegiado ?? ""}
            id="codigoColegiado"
            name="codigoColegiado"
            placeholder="Ej. COL-1003"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fechaContratacion">Fecha de contratacion</Label>
          <Input
            defaultValue={defaultValues?.fechaContratacion ?? ""}
            id="fechaContratacion"
            name="fechaContratacion"
            type="date"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input defaultValue={defaultValues?.nombre ?? ""} id="nombre" name="nombre" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="apellido1">Primer apellido</Label>
          <Input defaultValue={defaultValues?.apellido1 ?? ""} id="apellido1" name="apellido1" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="apellido2">Segundo apellido</Label>
          <Input defaultValue={defaultValues?.apellido2 ?? ""} id="apellido2" name="apellido2" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="especialidadId">Especialidad</Label>
          <select
            className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm"
            defaultValue={defaultValues?.especialidadId ?? ""}
            id="especialidadId"
            name="especialidadId"
          >
            <option value="">Seleccionar especialidad</option>
            {specialties.map((specialty) => (
              <option key={specialty.id} value={specialty.id}>
                {specialty.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Correo</Label>
          <Input defaultValue={defaultValues?.email ?? ""} id="email" name="email" type="email" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono">Telefono</Label>
          <Input defaultValue={defaultValues?.telefono ?? ""} id="telefono" name="telefono" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">
            {mode === "create" ? "Contrasena inicial" : "Nueva contrasena"}
          </Label>
          <Input
            id="password"
            name="password"
            placeholder={mode === "edit" ? "Dejar vacio para conservar la actual" : ""}
            type="password"
          />
          <p className="text-xs leading-5 text-muted-foreground">
            {mode === "create"
              ? "Se guardara como credencial inicial para el login del doctor."
              : "Solo completa este campo si quieres cambiar la contrasena actual."}
          </p>
        </div>
      </div>

      <SubmitButton mode={mode} />
    </form>
  );
}
