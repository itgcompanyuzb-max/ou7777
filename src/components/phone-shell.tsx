import { Link, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";

const NAV: { to: string; label: string }[] = [
  { to: "/", label: "Asosiy" },
  { to: "/transactions", label: "Amallar" },
  { to: "/insights", label: "Hisobot" },
  { to: "/cards", label: "Kartalar" },
];

export function PhoneShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto w-full max-w-[430px] pb-32">
        <div className="px-5 pt-6">{children}</div>
      </div>

      <nav className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2">
        <div className="glass flex items-center gap-1 rounded-full p-1.5">
          {NAV.map(({ to, label }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                aria-label={label}
                className={[
                  "rounded-full px-4 py-2.5 text-[13px] font-semibold tracking-tight transition-all",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground active:scale-95",
                ].join(" ")}
              >
                {label}
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
