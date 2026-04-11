"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, Save } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createAppointmentAction,
  type AppointmentFormState,
  updateAppointmentAction,
} from "@/lib/appointment-actions";
import type { AppointmentFormOption } from "@/lib/appointments";

type AppointmentFormValues = {
  pacienteId: string;
  doctorId: string;
  consultorioId: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: string;
  motivo: string;
  observaciones: string;
};

type AppointmentFormProps = {
  mode: "create" | "edit";
  appointmentId?: string;
  defaultValues?: AppointmentFormValues;
  patients: AppointmentFormOption[];
  doctors: AppointmentFormOption[];
  offices: AppointmentFormOption[];
};

const appointmentInitialState: AppointmentFormState = {
  error: null,
};

function SubmitButton({ mode }: { mode: "create" | "edit" }) {
  const { pending } = useFormStatus();

  return (
    <Button className="rounded-lg px-6" disabled={pending} type="submit">
      <Save className="size-4" />
      {pending
        ? mode === "create"
          ? "Creando cita..."
          : "Guardando cambios..."
        : mode === "create"
          ? "Crear cita"
          : "Guardar cambios"}
    </Button>
  );
}

export function AppointmentForm({
  mode,
  appointmentId,
  defaultValues,
  patients,
  doctors,
  offices,
}: AppointmentFormProps) {
  const action =
    mode === "create"
      ? createAppointmentAction
      : updateAppointmentAction.bind(null, appointmentId ?? "");

  const [state, formAction] = useActionState<AppointmentFormState, FormData>(
    action,
    appointmentInitialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="flex items-center justify-between">
        <Badge variant="secondary">
          {mode === "create" ? "Nueva cita" : "Editar cita"}
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

        <div className="space-y-2">
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

        <div className="space-y-2">
          <Label htmlFor="consultorioId">Consultorio</Label>
          <select
            className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm"
            defaultValue={defaultValues?.consultorioId ?? ""}
            id="consultorioId"
            name="consultorioId"
          >
            <option value="">Sin consultorio</option>
            {offices.map((office) => (
              <option key={office.id} value={office.id}>
                {office.label} {office.helper ? `(${office.helper})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="estado">Estado</Label>
          <select
            className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm"
            defaultValue={defaultValues?.estado ?? "programada"}
            id="estado"
            name="estado"
          >
            <option value="programada">Programada</option>
            <option value="confirmada">Confirmada</option>
            <option value="atendida">Atendida</option>
            <option value="cancelada">Cancelada</option>
            <option value="ausente">Ausente</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fecha">Fecha</Label>
          <Input defaultValue={defaultValues?.fecha ?? ""} id="fecha" name="fecha" type="date" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="horaInicio">Hora inicio</Label>
            <Input defaultValue={defaultValues?.horaInicio ?? ""} id="horaInicio" name="horaInicio" type="time" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="horaFin">Hora fin</Label>
            <Input defaultValue={defaultValues?.horaFin ?? ""} id="horaFin" name="horaFin" type="time" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="motivo">Motivo</Label>
        <Input defaultValue={defaultValues?.motivo ?? ""} id="motivo" name="motivo" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="observaciones">Observaciones</Label>
        <textarea
          className="min-h-28 w-full rounded-xl border border-input bg-white px-3 py-2 text-sm"
          defaultValue={defaultValues?.observaciones ?? ""}
          id="observaciones"
          name="observaciones"
        />
      </div>

      <SubmitButton mode={mode} />
    </form>
  );
}
