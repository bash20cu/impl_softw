import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type SiteHeaderProps = {
  current?: "inicio" | "login" | "dashboard";
};

const navItems: Array<{ href: string; label: string; key: SiteHeaderProps["current"] }> = [
  { href: "/", label: "Inicio", key: "inicio" },
  { href: "/login", label: "Login", key: "login" },
  { href: "/dashboard", label: "Dashboard", key: "dashboard" },
];

export function SiteHeader({ current }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-30">
      <div className="mx-auto mt-4 flex w-[min(1120px,calc(100%-2rem))] items-center justify-between rounded-full border border-white/60 bg-white/85 px-3 py-2 shadow-[0_12px_40px_rgba(17,33,31,0.08)] backdrop-blur">
        <div className="flex items-center gap-3">
          <Link
            className="flex items-center gap-3 rounded-full px-3 py-2 transition-colors hover:bg-muted/60"
            href="/"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f766e,#134e4a)] text-sm font-semibold text-white">
              CP
            </span>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold tracking-tight">ClinicaPlus</p>
              <p className="text-xs text-muted-foreground">Monolito SSR academico</p>
            </div>
          </Link>
          <Separator className="hidden h-6 sm:block" orientation="vertical" />
          <Badge className="hidden sm:inline-flex" variant="outline">
            Next.js + PostgreSQL + Vercel
          </Badge>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = current === item.key;

            return (
              <Button
                asChild
                className={active ? "shadow-none" : ""}
                key={item.href}
                size="sm"
                variant={active ? "default" : "ghost"}
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
