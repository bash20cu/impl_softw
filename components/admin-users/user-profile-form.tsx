"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, Save } from "lucide-react";

import { updateAdminUserAction, type AdminUserFormState } from "@/lib/admin-user-actions";
import type { RoleOption } from "@/lib/admin-users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AdminUserFormState = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="rounded-full px-6" disabled={pending} type="submit">
      <Save className="size-4" />
      {pending ? "Guardando..." : "Guardar perfil"}
    </Button>
  );
}

export function UserProfileForm({
  userId,
  currentUserId,
  defaultValues,
  roles,
}: {
  userId: string;
  currentUserId: string;
  defaultValues: {
    nombre: string;
    apellido1: string;
    apellido2: string;
    email: string;
    telefono: string;
    rol: string;
  };
  roles: RoleOption[];
}) {
  const [state, formAction] = useActionState<AdminUserFormState, FormData>(
    updateAdminUserAction.bind(null, userId, currentUserId),
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <Badge variant="secondary">Perfil y permisos</Badge>

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
          <Input defaultValue={defaultValues.nombre} id="nombre" name="nombre" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="apellido1">Primer apellido</Label>
          <Input defaultValue={defaultValues.apellido1} id="apellido1" name="apellido1" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="apellido2">Segundo apellido</Label>
          <Input defaultValue={defaultValues.apellido2} id="apellido2" name="apellido2" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rol">Rol</Label>
          <select
            className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm"
            defaultValue={defaultValues.rol}
            id="rol"
            name="rol"
          >
            {roles.map((role) => (
              <option key={role.id} value={role.nombre}>
                {role.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Correo</Label>
          <Input defaultValue={defaultValues.email} id="email" name="email" type="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefono">Telefono</Label>
          <Input defaultValue={defaultValues.telefono} id="telefono" name="telefono" />
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
