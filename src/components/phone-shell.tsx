import { Link, useLocation } from "@tanstack/react-router";
import { Home, ArrowLeftRight, BarChart3, Wallet, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

const NAV: { to: string; icon: LucideIcon; label: string }[] = [
  { to: "/", icon: Home, label: "Asosiy" },
  { to: "/transactions", icon: ArrowLeftRight, label: "Amallar" },
  { to: "/insights", icon: BarChart3, label: "Hisobot" },
  { to: "/cards", icon: Wallet, label: "Kartalar" },
];

export function PhoneShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto w-full max-w-[430px] pb-32">
        <div className="px-5 pt-6">{children}</div>
      </div>

      <nav className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2">
        <div className="glass flex items-center gap-1 rounded-full p-2">
          {NAV.map(({ to, icon: Icon, label }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                aria-label={label}
                className={[
                  "flex h-12 w-16 flex-col items-center justify-center rounded-full transition-all",
                  active
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground active:scale-95",
                ].join(" ")}
              >
                <Icon className="h-5 w-5" strokeWidth={2.2} />
                <span className="mt-0.5 text-[9px] font-semibold tracking-wide">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function ScreenHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <header className="mb-5 flex items-start justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle ? <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p> : null}
      </div>
      {right}
    </header>
  );
}
