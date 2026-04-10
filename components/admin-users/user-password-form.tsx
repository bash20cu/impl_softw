"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, KeyRound } from "lucide-react";

import { updateAdminUserPasswordAction, type AdminUserFormState } from "@/lib/admin-user-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AdminUserFormState = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="rounded-full px-6" disabled={pending} type="submit">
      <KeyRound className="size-4" />
      {pending ? "Actualizando..." : "Cambiar contrasena"}
    </Button>
  );
}

export function UserPasswordForm({ userId }: { userId: string }) {
  const [state, formAction] = useActionState<AdminUserFormState, FormData>(
    updateAdminUserPasswordAction.bind(null, userId),
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <Badge variant="secondary">Seguridad</Badge>

      {state.error ? (
        <div className="rounded-[1.25rem] border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p>{state.error}</p>
          </div>
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="password">Nueva contrasena</Label>
        <Input id="password" name="password" type="password" />
        <p className="text-xs leading-5 text-muted-foreground">
          Para este proyecto la contrasena se guarda como valor demo. Luego podemos migrarlo a hash real.
        </p>
      </div>

      <SubmitButton />
    </form>
  );
}
