import Link from "next/link";
import { ArrowRight, Shield, ShieldOff } from "lucide-react";

import { getAdminUsersList } from "@/lib/admin-users";
import { requireRole } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await requireRole(["admin"]);
  const users = await getAdminUsersList();

  return (
    <main className="app-shell pb-10">
      <SiteHeader current="usuarios-admin" />

      <section className="page-frame">
        <div className="page-stack">
          <section className="hero-panel">
            <div className="space-y-3">
              <Badge variant="secondary">Mantenimiento de acceso</Badge>
              <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
                Administracion de usuarios y permisos
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                Aqui el administrador puede ajustar roles, cambiar contrasenas y retirar acceso sin romper las relaciones del sistema.
              </p>
            </div>
          </section>

          <section className="grid gap-4">
            {users.map((user) => (
              <article
                className="list-card"
                key={user.id}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="outline">{user.rol}</Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {user.activo ? (
                          <Shield className="size-4 text-primary" />
                        ) : (
                          <ShieldOff className="size-4 text-amber-600" />
                        )}
                        {user.activo ? "Acceso activo" : "Acceso desactivado"}
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{user.nombreCompleto}</h2>
                      <div className="mt-2 flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:flex-wrap md:items-center md:gap-4">
                        <span>{user.email}</span>
                        <span>{user.telefono}</span>
                      </div>
                    </div>
                  </div>

                  <Button asChild className="rounded-lg px-5">
                    <Link href={`/admin/usuarios/${user.id}`}>
                      Gestionar
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}
