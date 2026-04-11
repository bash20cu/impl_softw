import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { requireSession } from "@/lib/auth";
import { SpecialtyForm } from "@/components/admin/specialty-form";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export default async function NewSpecialtyPage() {
  await requireSession();

  return (
    <main className="app-shell pb-10">
      <SiteHeader />
      <section className="px-4 pb-8 pt-8 md:px-8 lg:px-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <Button asChild className="rounded-lg px-5" variant="outline">
            <Link href="/especialidades">
              <ArrowLeft className="size-4" />
              Volver a especialidades
            </Link>
          </Button>
          <section className="panel-card">
            <SpecialtyForm mode="create" />
          </section>
        </div>
      </section>
    </main>
  );
}
