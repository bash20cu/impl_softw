"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CircleAlert, LockKeyhole } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction, type LoginActionState } from "@/lib/auth-actions";

const initialState: LoginActionState = {
  error: null,
  email: "",
};

const demoCredentials = [
  { role: "Administrador", email: "admin@clinicaplus.com", password: "hash_admin_demo" },
  { role: "Recepcionista", email: "recepcion@clinicaplus.com", password: "hash_recepcion_demo" },
  { role: "Doctor", email: "carlos.vargas@clinicaplus.com", password: "hash_doctor_1_demo" },
];

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="h-11 w-full rounded-xl text-sm" disabled={pending} type="submit">
      <LockKeyhole className="size-4" />
      {pending ? "Validando acceso..." : "Ingresar al sistema"}
    </Button>
  );
}

export function LoginForm() {
  const [state, action] = useActionState(loginAction, initialState);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Badge variant="secondary">Login real conectado al seed</Badge>
        <h2 className="text-3xl font-semibold tracking-tight">
          Bienvenido al panel de ClinicaPlus
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Esta version valida credenciales demo directamente contra la tabla
          `usuarios` y crea una sesion simple por cookie.
        </p>
      </div>

      <form action={action} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Correo institucional</Label>
          <Input
            className="h-11 rounded-xl bg-white"
            defaultValue={state.email}
            id="email"
            name="email"
            placeholder="recepcion@clinicaplus.com"
            type="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contrasena</Label>
          <Input
            className="h-11 rounded-xl bg-white"
            id="password"
            name="password"
            placeholder="Ingresa tu contrasena"
            type="password"
          />
        </div>

        {state.error ? (
          <div className="rounded-[1.25rem] border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3 text-red-900">
              <CircleAlert className="mt-0.5 size-4 shrink-0" />
              <p className="text-sm leading-6">{state.error}</p>
            </div>
          </div>
        ) : null}

        <SubmitButton />
      </form>

      <div className="rounded-lg border border-border/70 bg-muted/50 p-4">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Credenciales demo disponibles hoy
        </p>
        <div className="mt-4 grid gap-3">
          {demoCredentials.map((credential) => (
            <div
              className="rounded-[1rem] border border-border/70 bg-white/85 p-3 text-sm"
              key={credential.email}
            >
              <p className="font-semibold">{credential.role}</p>
              <p className="mt-1 text-muted-foreground">{credential.email}</p>
              <p className="mt-1 text-muted-foreground">
                Contrasena: <span className="font-mono text-foreground">{credential.password}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
