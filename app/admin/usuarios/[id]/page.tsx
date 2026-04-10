import Link from "next/link";
import { ArrowLeft, Shield, ShieldOff } from "lucide-react";
import { notFound } from "next/navigation";

import { toggleAdminUserAccessAction } from "@/lib/admin-user-actions";
import { getAdminUserById, getRoleOptions } from "@/lib/admin-users";
import { getCurrentSession, requireRole } from "@/lib/auth";
import { UserPasswordForm } from "@/components/admin-users/user-password-form";
import { UserProfileForm } from "@/components/admin-users/user-profile-form";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type AdminUserDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminUserDetailPage({ params }: AdminUserDetailPageProps) {
  await requireRole(["admin"]);
  const session = await getCurrentSession();
  const { id } = await params;
  const [user, roles] = await Promise.all([
    getAdminUserById(id),
    getRoleOptions(),
  ]);

  if (!user || !session) {
    notFound();
  }

  return (
    <main className="app-shell pb-10">
      <SiteHeader current="usuarios-admin" />

      <section className="px-4 pb-8 pt-8 md:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-full px-5" variant="outline">
              <Link href="/admin/usuarios">
                <ArrowLeft className="size-4" />
                Volver a usuarios
              </Link>
            </Button>

            <form action={toggleAdminUserAccessAction.bind(null, user.id, session.userId, !user.activo)}>
              <Button className="rounded-full px-5" type="submit" variant="outline">
                {user.activo ? (
                  <>
                    <ShieldOff className="size-4" />
                    Eliminar acceso
                  </>
                ) : (
                  <>
                    <Shield className="size-4" />
                    Reactivar acceso
                  </>
                )}
              </Button>
            </form>
          </div>

          <section className="rounded-[2rem] border border-border/70 bg-white/88 p-6 shadow-[0_18px_50px_rgba(17,33,31,0.08)] md:p-8">
            <div className="space-y-3">
              <Badge variant="secondary">{user.rol}</Badge>
              <h1 className="text-4xl font-semibold tracking-tight">{user.nombreCompleto}</h1>
              <p className="text-sm text-muted-foreground">
                Estado actual: {user.activo ? "Activo" : "Sin acceso al sistema"}
              </p>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-[2rem] border border-border/70 bg-white/88 p-6 shadow-[0_18px_50px_rgba(17,33,31,0.08)]">
              <UserProfileForm
                currentUserId={session.userId}
                defaultValues={{
                  nombre: user.nombre,
                  apellido1: user.apellido1,
                  apellido2: user.apellido2,
                  email: user.email,
                  telefono: user.telefono,
                  rol: user.rol,
                }}
                roles={roles}
                userId={user.id}
              />
            </section>

            <section className="rounded-[2rem] border border-border/70 bg-white/88 p-6 shadow-[0_18px_50px_rgba(17,33,31,0.08)]">
              <UserPasswordForm userId={user.id} />
            </section>
          </section>
        </div>
      </section>
    </main>
  );
}
