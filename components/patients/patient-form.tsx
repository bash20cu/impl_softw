"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { AlertCircle, Save } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createPatientAction,
  type PatientFormState,
  updatePatientAction,
} from "@/lib/patient-actions";

type PatientFormValues = {
  numeroExpediente: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  fechaNacimiento: string;
  genero: string;
  telefono: string;
  email: string;
  direccion: string;
  contactoEmergenciaNombre: string;
  contactoEmergenciaTelefono: string;
};

type PatientFormProps = {
  mode: "create" | "edit";
  patientId?: string;
  defaultValues?: PatientFormValues;
};

const patientInitialState: PatientFormState = {
  error: null,
};

function SubmitButton({ mode }: { mode: "create" | "edit" }) {
  const { pending } = useFormStatus();

  return (
    <Button className="rounded-full px-6" disabled={pending} type="submit">
      <Save className="size-4" />
      {pending
        ? mode === "create"
          ? "Creando paciente..."
          : "Guardando cambios..."
        : mode === "create"
          ? "Crear paciente"
          : "Guardar cambios"}
    </Button>
  );
}

export function PatientForm({ mode, patientId, defaultValues }: PatientFormProps) {
  const action = mode === "create"
    ? createPatientAction
    : updatePatientAction.bind(null, patientId ?? "");

  const [state, formAction] = useActionState<PatientFormState, FormData>(
    action,
    patientInitialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="flex items-center justify-between">
        <Badge variant="secondary">
          {mode === "create" ? "Nuevo paciente" : "Editar paciente"}
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
          <Label htmlFor="numeroExpediente">Numero de expediente</Label>
          <Input
            defaultValue={defaultValues?.numeroExpediente ?? ""}
            id="numeroExpediente"
            name="numeroExpediente"
            placeholder={mode === "create" ? "Se genera automaticamente si lo dejas vacio" : ""}
          />
          {mode === "create" ? (
            <p className="text-xs leading-5 text-muted-foreground">
              Si no escribes un expediente, el sistema genera el siguiente codigo disponible.
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="fechaNacimiento">Fecha de nacimiento</Label>
          <Input defaultValue={defaultValues?.fechaNacimiento ?? ""} id="fechaNacimiento" name="fechaNacimiento" type="date" />
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
          <Label htmlFor="genero">Genero</Label>
          <select
            className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm"
            defaultValue={defaultValues?.genero ?? ""}
            id="genero"
            name="genero"
          >
            <option value="">Seleccionar</option>
            <option value="femenino">Femenino</option>
            <option value="masculino">Masculino</option>
            <option value="otro">Otro</option>
            <option value="prefiero_no_indicar">Prefiero no indicar</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefono">Telefono</Label>
          <Input defaultValue={defaultValues?.telefono ?? ""} id="telefono" name="telefono" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Correo</Label>
          <Input defaultValue={defaultValues?.email ?? ""} id="email" name="email" type="email" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="direccion">Direccion</Label>
        <Input defaultValue={defaultValues?.direccion ?? ""} id="direccion" name="direccion" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contactoEmergenciaNombre">Contacto de emergencia</Label>
          <Input
            defaultValue={defaultValues?.contactoEmergenciaNombre ?? ""}
            id="contactoEmergenciaNombre"
            name="contactoEmergenciaNombre"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactoEmergenciaTelefono">Telefono de emergencia</Label>
          <Input
            defaultValue={defaultValues?.contactoEmergenciaTelefono ?? ""}
            id="contactoEmergenciaTelefono"
            name="contactoEmergenciaTelefono"
          />
        </div>
      </div>

      <SubmitButton mode={mode} />
    </form>
  );
}
