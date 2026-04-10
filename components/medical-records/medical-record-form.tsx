"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, Save } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  createMedicalRecordAction,
  type MedicalRecordFormState,
  updateMedicalRecordAction,
} from "@/lib/medical-record-actions";
import type { MedicalRecordFormOption } from "@/lib/medical-records";

type MedicalRecordFormValues = {
  pacienteId: string;
  citaId: string;
  doctorId: string;
  diagnostico: string;
  sintomas: string;
  tratamiento: string;
  notas: string;
};

type MedicalRecordFormProps = {
  mode: "create" | "edit";
  recordId?: string;
  defaultValues?: MedicalRecordFormValues;
  patients: MedicalRecordFormOption[];
  doctors: MedicalRecordFormOption[];
  appointments: MedicalRecordFormOption[];
};

const medicalRecordInitialState: MedicalRecordFormState = {
  error: null,
};

function SubmitButton({ mode }: { mode: "create" | "edit" }) {
  const { pending } = useFormStatus();

  return (
    <Button className="rounded-full px-6" disabled={pending} type="submit">
      <Save className="size-4" />
      {pending
        ? mode === "create"
          ? "Creando expediente..."
          : "Guardando cambios..."
        : mode === "create"
          ? "Crear expediente"
          : "Guardar cambios"}
    </Button>
  );
}

export function MedicalRecordForm({
  mode,
  recordId,
  defaultValues,
  patients,
  doctors,
  appointments,
}: MedicalRecordFormProps) {
  const action =
    mode === "create"
      ? createMedicalRecordAction
      : updateMedicalRecordAction.bind(null, recordId ?? "");

  const [state, formAction] = useActionState<MedicalRecordFormState, FormData>(
    action,
    medicalRecordInitialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="flex items-center justify-between">
        <Badge variant="secondary">
          {mode === "create" ? "Nuevo expediente" : "Editar expediente"}
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
            Si eliges una cita, el sistema toma automaticamente el paciente y el doctor correctos.
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

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="doctorId">Doctor</Label>
          <select
            className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm"
            defaultValue={defaultValues?.doctorId ?? ""}
            id="doctorId"
            name="doctorId"
          >
            <option value="">Seleccionar doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="diagnostico">Diagnostico</Label>
        <textarea
          className="min-h-24 w-full rounded-xl border border-input bg-white px-3 py-2 text-sm"
          defaultValue={defaultValues?.diagnostico ?? ""}
          id="diagnostico"
          name="diagnostico"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sintomas">Sintomas</Label>
        <textarea
          className="min-h-24 w-full rounded-xl border border-input bg-white px-3 py-2 text-sm"
          defaultValue={defaultValues?.sintomas ?? ""}
          id="sintomas"
          name="sintomas"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tratamiento">Tratamiento</Label>
        <textarea
          className="min-h-24 w-full rounded-xl border border-input bg-white px-3 py-2 text-sm"
          defaultValue={defaultValues?.tratamiento ?? ""}
          id="tratamiento"
          name="tratamiento"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notas">Notas</Label>
        <textarea
          className="min-h-28 w-full rounded-xl border border-input bg-white px-3 py-2 text-sm"
          defaultValue={defaultValues?.notas ?? ""}
          id="notas"
          name="notas"
        />
      </div>

      <SubmitButton mode={mode} />
    </form>
  );
}
